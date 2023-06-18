export const IpcCalls = {
  handleExport: 'ecu:handleExport',
  handleImport: 'ecu:handleImport',
  onExport: 'ecu:onExport',
  onImport: 'ecu:onImport',
  onVarDump: 'ecu:onVarDump',
};

export interface Variable {
  name: string;
  value: string | number;
  isStatic?: boolean;
  sample?: string | undefined;
}

export type MapOfVariables = { [key: string]: Variable };

export interface ComponentDef {
  id: number;
  name?: string;
  order?: number;
  componentType: string;
  [others: string]: any;
}

export interface CommonProps {
  key: string;
  x: number;
  y: number;
  visible: boolean;
}
