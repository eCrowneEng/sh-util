/* eslint-disable import/prefer-default-export */
import { CommonProps, ComponentDef } from '../../../../constants';

export function fromCommonProps(def: ComponentDef, index: number): CommonProps {
  const { x, y } = def;

  return {
    x,
    y,
    key: `c-${index}`,
    visible: def.visible !== undefined ? Boolean(def.visible) : true,
  };
}
