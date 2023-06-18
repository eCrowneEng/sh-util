import React from 'react';
import { Rect } from 'react-konva';
import { colors } from 'renderer/features/oled/SHStyles';
import { CommonProps, ComponentDef } from '../../../../constants';
import { fromCommonProps } from './common';

/**
 * Example config
 *

[Rectangle]
X=0
Y=8
Width=4
Height=2
Fill=1
Color=1
CornerRadius=0
visible=1

*
 */

export interface RectangleConfigType extends ComponentDef {
  componentType: 'rectangle';
  x: number;
  y: number;
  height: number;
  width: number;
  color: number;
  cornerRadius: number;
}

/**
 * Rectangle component props
 */
export interface SHRectangleProps extends CommonProps {
  cornerRadius: number;
  colorType: number;
  width: number;
  height: number;
}

/**
 * Rect element that represents a SimHub rectangle
 */
export function SHRectangle(props: SHRectangleProps): React.ReactElement {
  const { colorType, ...restOfProps } = props;
  const fill = colors[colorType] ?? colors[1];

  // globalCompositeOperation="xor"
  return <Rect fill={fill} {...restOfProps} />;
}

/**
 * Factory function to render an SVG Rect (konva) from the ini config of a
 *  rectangle. We try to avoid duplication of conversions by using
 *  fromCommonProps which may be reused by multiple elements.
 */
export function from(
  def: RectangleConfigType,
  index: number
): React.ReactElement {
  const { height, width } = def;
  const props: SHRectangleProps = {
    height,
    width,
    colorType: def.color ?? 1,
    cornerRadius: def.cornerRadius ?? 0,
    ...fromCommonProps(def, index),
  };
  return <SHRectangle {...props} />;
}

/**
 * A new rectangle will have these properties
 */
export const initialProperties: RectangleConfigType = {
  id: -1,
  componentType: 'rectangle',
  color: 1,
  x: 50,
  y: 20,
  height: 10,
  width: 10,
  visible: 1,
  cornerRadius: 0,
};
