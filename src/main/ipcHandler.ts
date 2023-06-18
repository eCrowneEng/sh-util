import fs from 'fs/promises';
import path from 'path';
import { dialog } from 'electron';
import { IpcCalls, MapOfVariables, Variable } from '../constants';
import { ExportRequest } from './preload';
import OkIni from './lib/ok-ini';

/**
 * Wrap a value so that it's not evaluated
 */
function getStaticValue(value: string | number): string {
  return `'${value}'`;
}

/**
 * Get sample value from a variable
 */
function getValueText(entry: [string, Variable], useSamples: boolean): string {
  const [, properties] = entry;
  const { value, sample, isStatic = false } = properties;
  const sampleValueToUse = sample ?? value;

  const values = `${useSamples ? sampleValueToUse : value}`;
  return isStatic ? getStaticValue(value) : values;
}

/**
 * Reference a variable name or error
 */
function referenceVariable(
  name: string,
  mapOfVariables: MapOfVariables
): string {
  const variable = mapOfVariables[name];
  return variable ? `[context.${variable?.name}]` : '{error}';
}

/**
 * Generate a property referencing a variable for destructuring
 */
function objectWithVariableOrEmpty(
  nameOfProperty: string,
  nameOfVariable: string,
  mapOfVariables: MapOfVariables
): { [key: string]: string } {
  return nameOfVariable
    ? { [nameOfProperty]: referenceVariable(nameOfVariable, mapOfVariables) }
    : {};
}

/**
 * Generate a static string property for destructuring
 */
function stringProperty(
  nameOfProperty: string,
  value: string
): { [key: string]: string } {
  return nameOfProperty ? { [nameOfProperty]: getStaticValue(value) } : {};
}

const defaultPath = path.join(
  process.env.HOME ?? '',
  process.platform === 'win32'
    ? 'C:/Program Files (x86)/SimHub/OLEDTemplate/'
    : '/.wine/drive_c/Program Files (x86)/SimHub/OLEDTemplate/'
)

export default (ipcMain: Electron.IpcMain) => {
  /**
   * Open Ini
   */
  ipcMain.handle(IpcCalls.handleImport, async (event, request: any) => {
    return dialog
      .showOpenDialog({
        title: 'Open OLED Ini',
        properties: ['openFile'],
        filters: [{ name: 'Ini Files', extensions: ['ini'] }],
        defaultPath,
      })
      .then((result: Electron.OpenDialogReturnValue) => {
        if (result.canceled || !result.filePaths.length) {
          return undefined;
        }
        return fs.readFile(result.filePaths[0]);
      })
      .then((buffer) => {
        if (!buffer) {
          return undefined;
        }
        const ini = new OkIni({ keepQuotedStrings: true });
        ini.fromIni(buffer.toString());
        return ini.dump();
      });
  });

  /**
   * Export Ini
   */
  ipcMain.handle(
    IpcCalls.handleExport,
    async (event, request: ExportRequest) => {
      return dialog
        .showSaveDialog({
          title: 'Save to',
          defaultPath,
          filters: [{ name: 'Ini Files', extensions: ['ini'] }],
        })
        .then((result) => {
          if (result.canceled || !result.filePath) {
            return undefined;
          }
          const ini = new OkIni();
          const useSamples = request.options?.useSampleValues ?? false;

          Object.entries(request.variables).forEach((entry) => {
            const [variableNameRef, properties] = entry;
            const { isStatic, sample, ...restOfProperties } = properties;
            const valueToUse = getValueText(entry, useSamples);

            ini.add({
              name: 'variable',
              contents: {
                ...restOfProperties,
                value: valueToUse,
                name: `'${properties.name}'`,
                sample: typeof sample === 'undefined' ? '' : sample,
              },
            });
          });

          request.componentDefinitions
            .sort(
              (a, b) =>
                (a.order ?? Number.MAX_VALUE) - (b.order ?? Number.MAX_VALUE)
            )
            .forEach((entry) => {
              const { componentType, text, value, name, ...properties } = entry;
              const textProp = objectWithVariableOrEmpty(
                'text',
                text,
                request.variables
              );
              const valueProp = objectWithVariableOrEmpty(
                'value',
                value,
                request.variables
              );
              const nameProp = stringProperty('name', name ?? '');

              ini.add({
                name: componentType,
                contents: {
                  ...textProp,
                  ...valueProp,
                  ...properties,
                  ...nameProp,
                },
              });
            });
          const iniResult = ini.render();
          return fs.writeFile(path.normalize(result.filePath), iniResult);
        });
    }
  );
};
