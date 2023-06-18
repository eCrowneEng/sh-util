import React from 'react';
import { Rect } from 'react-konva';
import { colors } from 'renderer/features/oled/SHStyles';
import {
  Variable,
  ComponentDef,
  CommonProps,
  MapOfVariables,
} from '../../../../constants';
import { fromCommonProps } from './common';

/**
 * Example config

[Progressbar]
X=1
Y=10
Color=1
Width=2
Height=6
Minvalue=0
Maxvalue=-0.5
value=isnull([PersistantTrackerPlugin.AllTimeBestLiveDeltaProgressSeconds],0)
vertical=1
reverse=0

*/

/**
 * Roughly the interface we can get from the ini
 */
export interface ProgressBarConfigType extends ComponentDef {
  componentType: 'progressBar';
  x: number;
  y: number;
  color: number;
  height: number;
  width: number;
  minValue: number;
  maxValue: number;
  value: string;
  vertical: number;
  reverse: number;
}

/**
 * Parameters for a progress bar
 */
interface ParametricDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  minValue: number;
  maxValue: number;
  vertical: number;
  reverse: number;
  value: Variable;
}

/**
 * Dimension specifications
 */
interface DimensionSpec {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Props for the SHProgressBar component
 */
export interface SHProgressBarProps extends ParametricDimensions, CommonProps {
  colorType: number;
}

/**
 * Function that calculates the actual rect coordinates and dimensions based
 *  on the ini configuration for a progress bar
 */
function withParametricDimensions(
  parametricDimensions: ParametricDimensions
): DimensionSpec {
  const { minValue, maxValue, value, vertical, reverse, height, width, x, y } =
    parametricDimensions;
  const valueAsNumber = parseFloat(
    value.sample?.toString() ?? value.value?.toString() ?? ''
  );
  const percentOfBar = Math.max(
    0,
    (valueAsNumber - minValue) / (maxValue - minValue)
  );

  let xCalc = 0;
  let yCalc = 0;
  let heightCalc = 0;
  let widthCalc = 0;

  if (!vertical && !reverse) {
    // A progress bar from left to right
    xCalc = x;
    yCalc = y;
    heightCalc = height;
    widthCalc = percentOfBar * width;
  } else if (!vertical && reverse) {
    // A reverse horizontal progress bar.. starts from the right
    xCalc = x + width - percentOfBar * width;
    yCalc = y;
    heightCalc = height;
    widthCalc = percentOfBar * width;
  } else if (vertical && !reverse) {
    // A vertical progress bar.. starts from the top
    xCalc = x;
    yCalc = y;
    heightCalc = percentOfBar * height;
    widthCalc = width;
  } else {
    // A vertical progress bar.. starts from the bottom
    xCalc = x;
    yCalc = y + height - percentOfBar * height;
    heightCalc = percentOfBar * height;
    widthCalc = width;
  }

  return { x: xCalc, y: yCalc, width: widthCalc, height: heightCalc };
}

/**
 * Rect element that represents a SimHub progress bar
 */
export function SHProgressBar(props: SHProgressBarProps): React.ReactElement {
  const { colorType, value, ...restOfProps } = props;
  const fill = colors[colorType] ?? colors[1];

  return (
    <Rect fill={fill} {...restOfProps} {...withParametricDimensions(props)} />
  );
}

/**
 * Factory function to render an SVG Rect (konva) from the ini config of a
 *  progress bar. We try to avoid duplication of conversions by using
 *  fromCommonProps which may be reused by multiple elements.
 */
export function from(
  def: ProgressBarConfigType,
  variables: MapOfVariables,
  index: number
): React.ReactElement {
  const { height, width, minValue, maxValue, vertical, reverse, value } = def;
  const props: SHProgressBarProps = {
    height,
    width,
    colorType: def.color ?? 1,
    minValue: minValue ?? 0,
    maxValue: maxValue ?? 100,
    vertical: vertical ?? 0,
    reverse: reverse ?? 0,
    value: variables[value] ?? 0,
    ...fromCommonProps(def, index),
  };
  return <SHProgressBar {...props} />;
}

/**
 * A new progressbar will have these properties
 */
export const initialProperties: ProgressBarConfigType = {
  id: -1,
  componentType: 'progressBar',
  color: 1,
  x: 50,
  y: 20,
  height: 10,
  width: 50,
  minValue: 0,
  maxValue: 100,
  value: '_replace_me',
  vertical: 0,
  reverse: 0,
  visible: 1,
};
