import { AppDispatch, AppThunk, RootState } from './store';
import { ComponentDef, MapOfVariables } from '../../constants';
import {
  selectComponents,
  selectVariablesByName,
} from '../features/oled/oledReducer';

const handleExport: () => AppThunk =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const componentDefs: ComponentDef[] = selectComponents(state);
    const mapOfVariables: MapOfVariables = selectVariablesByName(state);
    try {
      const res = await window.electron.ipcRenderer.handleExport({
        componentDefinitions: componentDefs,
        variables: mapOfVariables,
        options: { useSampleValues: false },
      });
      console.log('result ok: ', res);
    } catch (e) {
      console.error('error exporting', e);
    }
  };

export default handleExport;
