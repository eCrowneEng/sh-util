import { ComponentDef, MapOfVariables } from './constants';

export interface OledState {
  elementCount: number;
  variablesByName: MapOfVariables;
  errorsByVariableName: { [key: string]: string | undefined };
  componentById: { [key: string]: ComponentDef };
}

export interface GlobalState {
  oled: OledState;
}
