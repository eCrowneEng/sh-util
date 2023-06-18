import { Text } from 'react-konva';
import Konva from 'konva';
import React, { useEffect, useRef, useState } from 'react';
import {
  withHorizontalAlignStrategy,
  withVerticalAlignStrategy,
} from 'renderer/lib/positioning';
import {
  colors,
  shFontStyles,
  wrapStrategies,
} from 'renderer/features/oled/SHStyles';
import {
  CommonProps,
  ComponentDef,
  MapOfVariables,
  Variable,
} from '../../../../constants';
import { fromCommonProps } from './common';

/**
 * Example config
 *

[Text]
X=42
Y=7
Color=1
Text=([context.currentdelta]>=0?'+':'')+format([context.currentdelta],'0.00')
FontSize=1
Align=2

 */

/**
 * Roughly the interface we can get from the ini
 */
export interface TextConfigType extends ComponentDef {
  componentType: 'text';
  fontType: number;
  fontSize: number;
  color: number;
  align: number;
  x: number;
  y: number;
  text: string;
  visible: number;
  order: number;
}

/**
 * Text component props
 */
export interface SHTextProps extends CommonProps {
  fontType: number;
  size: number;
  colorType: number;
  alignType: number;
  wrapType: number; // lol where did I get this from?
  textVariable: Variable;
}

/**
 * Rect element that represents a SimHub Text
 */
export default function SHText(props: SHTextProps & Konva.TextConfig) {
  const [currentWidth, setCurrentWidth] = useState<number>(-1);
  const [currentHeight, setCurrentHeight] = useState<number>(-1);
  const {
    fontType,
    wrapType,
    textVariable,
    size,
    alignType,
    x,
    y,
    colorType,
    ...restOfProps
  } = props;
  const { fontFamily, sizes } = shFontStyles[`type${fontType}`];
  const { xOffset, yOffset, ...restOfSizeProps } = sizes[size];
  const ref = useRef<Konva.Text>(null);

  const width = ref.current?.width();
  const height = ref.current?.height();
  useEffect(() => {
    setCurrentWidth(ref.current?.width() ?? -1);
    setCurrentHeight(ref.current?.height() ?? -1);
  }, [width, height]);

  const wrap = wrapStrategies[wrapType];
  const fill = colors[colorType] ?? colors[1];
  const allProps = {
    text: textVariable?.sample ?? textVariable?.value?.toString() ?? '{ERROR}',
    wrap,
    ...restOfSizeProps,
    ...restOfProps,
    ...withVerticalAlignStrategy(y, yOffset ?? 0, currentHeight),
    ...withHorizontalAlignStrategy(alignType, x, xOffset ?? 0, currentWidth),
  };

  return <Text fontFamily={fontFamily} fill={fill} ref={ref} {...allProps} />;
}

/**
 * Factory function to render an SVG Text (konva) from the ini config of
 *  text. We try to avoid duplication of conversions by using fromCommonProps
 *  which may be reused by multiple elements.
 */
export function from(
  def: TextConfigType,
  variables: MapOfVariables,
  index: number
): React.ReactElement {
  const { text } = def;
  const props: SHTextProps = {
    textVariable: variables[text],
    wrapType: def.wrapType ?? 0,
    fontType: def.fontType ?? 0,
    size: def.fontSize ?? 1,
    alignType: def.align ?? 1,
    colorType: def.color ?? 1,
    ...fromCommonProps(def, index),
  };

  return <SHText {...props} />;
}

/**
 * A new text will have these properties
 */
export const initialProperties: TextConfigType = {
  id: 1,
  componentType: 'text',
  fontType: 0,
  fontSize: 1,
  color: 1,
  align: 1,
  x: 0,
  y: 0,
  visible: 1,
  order: 0,
  text: '_replace_me',
};
