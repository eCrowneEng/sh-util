import React from 'react';
import { Line } from 'react-konva';
import { colors } from 'renderer/features/oled/SHStyles';
import { CommonProps, ComponentDef } from '../../../../constants';
import { fromCommonProps } from './common';

/**

 Example ini config

[line]
x=0
y=15
x2=84
y2=15

 */

/**
 * Roughly the interface we can get from the ini
 */
export interface LineConfigType extends ComponentDef {
  componentType: 'line';
  x: number;
  y: number;
  x2: number;
  y2: number;
  color: number;
}

/**
 * Props for the SHLine component
 */
export interface SHLineProps extends CommonProps {
  colorType: number;
  x2: number;
  y2: number;
}

/**
 * Line element that represents the SimHub line
 */
export function SHLine(props: SHLineProps): React.ReactElement {
  const { colorType, x, x2, y, y2, ...restOfProps } = props;
  const fill = colors[colorType] ?? colors[1];

  return (
    <Line
      points={[x, y, x2, y2]}
      strokeWidth={1}
      stroke={fill}
      {...restOfProps}
    />
  );
}

/**
 * Factory function to render an SVG Line Element (konva) from the ini config.
 *  We try to avoid duplication of conversions by using fromCommonProps
 *  which may be reused by multiple elements.
 */
export function from(def: LineConfigType, index: number): React.ReactElement {
  const { x2, y2 } = def;
  const props: SHLineProps = {
    x2,
    y2,
    colorType: def.color ?? 1,
    ...fromCommonProps(def, index),
  };
  return <SHLine {...props} />;
}

/**
 * A new line will have these properties
 */
export const initialProperties: LineConfigType = {
  id: -1,
  componentType: 'line',
  color: 1,
  x: 20,
  y: 20,
  x2: 90,
  y2: 10,
  visible: 1,
};
