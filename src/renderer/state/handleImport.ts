import store, { AppDispatch, AppThunk, RootState } from './store';
import OkIni, { IniContents, Properties } from '../../main/lib/ok-ini';
import { ComponentDef, MapOfVariables } from '../../constants';
import { setComponents, setVariables } from '../features/oled/oledReducer';

function removeQuotesIfQuoted(value: string): string {
  return OkIni.isQuoted(value.toString())
    ? value.toString().slice(1, -1)
    : value;
}

const handleImport: () => AppThunk =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const iniContents: IniContents | undefined =
        await window.electron.ipcRenderer.handleImport();
      const variables: MapOfVariables = {};
      const componentDef: Array<ComponentDef> = [];
      let componentCounter = 0;
      iniContents?.sections?.forEach((section) => {
        if (section.name.toLowerCase() === 'variable') {
          const { name, value, ...restOfContents } = section.contents;
          if (!name) {
            return;
          }
          const match = name!!
            .toString()
            .match(/['"](?<cleanName>[a-zA-Z0-9-]+)['"]/i);
          const cleanName = match?.groups?.cleanName ?? name;
          variables[`[context.${cleanName}]`] = {
            name: cleanName.toString(),
            value: removeQuotesIfQuoted(value.toString()),
            isStatic: OkIni.isQuoted(value.toString()),
            ...restOfContents,
          };
        } else {
          const componentType = section.name.toLowerCase();
          if (!componentType) {
            return;
          }
          const sectionContents: Partial<ComponentDef> = {};
          Object.entries(section.contents).forEach(([key, value]) => {
            sectionContents[key] = value;
          });

          const { id, name, order } = sectionContents;
          componentDef.push({
            ...section.contents,

            id: id ?? componentCounter,
            name: removeQuotesIfQuoted(name ?? 'unnamed'),
            order: order ?? componentCounter,
            componentType,
          });
          componentCounter += 1;
        }
      });

      if (componentDef.length > 0) {
        store.dispatch(setComponents(componentDef));
      }
      if (Object.keys(variables).length > 0) {
        store.dispatch(setVariables(variables));
      }

      console.log('result ok: ', iniContents);
    } catch (e) {
      console.error('error importing', e);
    }
  };

export default handleImport;
