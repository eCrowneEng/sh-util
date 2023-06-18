import { Dispatch } from '@reduxjs/toolkit';
import { ChangeEvent } from 'react';
import { ComponentDef, Variable } from '../../../../constants';
import { updateComponent, updateVariable } from '../oledReducer';

export interface EditorProps {
  oledWidth: number;
  oledHeight: number;
}

export function makeFieldChangeHandler(
  dispatch: Dispatch,
  item: ComponentDef
): (ev: ChangeEvent<HTMLInputElement>) => void {
  return (ev) => {
    const { name, type, value, checked } = ev.currentTarget;
    let transformedValue: number | string | boolean = value;
    switch (type) {
      case 'number':
        transformedValue = parseInt(value ?? 0, 10);
        break;
      case 'checkbox':
        transformedValue = checked;
        break;
      default:
        transformedValue = value;
        break;
    }
    dispatch(updateComponent({ ...item, [name]: transformedValue }));
  };
}

export function makeFieldChangeHandlerForVariable(
  dispatch: Dispatch,
  variable: Variable
): (ev: ChangeEvent<HTMLInputElement>) => void {
  return (ev) => {
    const { name, type, value, checked } = ev.currentTarget;
    let transformedValue: number | string | boolean = value;
    switch (type) {
      case 'number':
        transformedValue = parseInt(value ?? 0, 10);
        break;
      case 'checkbox':
        transformedValue = checked;
        break;
      default:
        transformedValue = value;
        break;
    }
    dispatch(updateVariable({ ...variable, [name]: transformedValue }));
  };
}
