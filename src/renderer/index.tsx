import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import React from 'react';
import store from './state/store';
import App from './App';
import handleExport from './state/handleExport';
import handleImport from './state/handleImport';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

window.electron.ipcRenderer.onExport(() => {
  store.dispatch(handleExport());
});
window.electron.ipcRenderer.onImport(() => {
  store.dispatch(handleImport());
});
window.electron.ipcRenderer.onVarDump(() => {
  const state = store.getState().oled;
  const componentDef = Object.values(state.componentById).sort(
    (a, b) => a.order ?? Number.MAX_VALUE - b.order ?? Number.MAX_VALUE
  );
  const mapOfVariables = state.variablesByName;
  // eslint-disable-next-line no-console
  console.log('components', JSON.stringify(componentDef));
  // eslint-disable-next-line no-console
  console.log('vars', JSON.stringify(mapOfVariables));
});
