// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { ComponentDef, IpcCalls, Variable } from '../constants';
import IpcRendererEvent = Electron.IpcRendererEvent;

export interface ExportRequest {
  componentDefinitions: ComponentDef[];
  variables: { [key: string]: Variable };
  options?: {
    useSampleValues: boolean;
  };
}

const electronHandler = {
  ipcRenderer: {
    /**
     * Export ini file
     */
    handleExport: (req: ExportRequest) =>
      ipcRenderer.invoke(IpcCalls.handleExport, req),

    handleImport: () => ipcRenderer.invoke(IpcCalls.handleImport, {}),

    /**
     * Incoming call from main to do export from renderer
     */
    onExport: (callback: (event: IpcRendererEvent) => void) =>
      ipcRenderer.on(IpcCalls.onExport, callback),

    onImport: (callback: (event: IpcRendererEvent) => void) =>
      ipcRenderer.on(IpcCalls.onImport, callback),

    onVarDump: (callback: (event: IpcRendererEvent) => void) =>
      ipcRenderer.on(IpcCalls.onVarDump, callback),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
