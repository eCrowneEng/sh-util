import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { keyBy } from 'lodash';
import { createSelector } from 'reselect';
import { parseScript } from 'esprima';
import { ComponentDef, MapOfVariables, Variable } from '../../../constants';
import { GlobalState, OledState } from '../../../state';
import { initialProperties as defaultText } from './elements/SHText';
import { initialProperties as defaultProgressBar } from './elements/SHProgressBar';
import { initialProperties as defaultRectangle } from './elements/SHRectangle';
import { initialProperties as defaultLine } from './elements/SHLine';

const initialState: OledState = {
  elementCount: 0,
  variablesByName: {},
  componentById: {},
  errorsByVariableName: {},
};

interface DeleteItemAction {
  id: number;
}

export const oledSlice = createSlice({
  name: 'oled',
  initialState,
  reducers: {
    addText: (state, action: PayloadAction<undefined>) => {
      const count: number = state.elementCount;
      const variableName = `v${count}`;
      const variableNameRef = `[context.${variableName}]`;
      const newVariable: Variable = {
        name: variableName,
        value: 'new',
        isStatic: true,
        sample: undefined,
      };
      state.componentById[count] = {
        ...defaultText,
        id: count,
        order: 0,
        name: `Text ${count + 1}`,
        text: variableNameRef,
      };
      state.variablesByName[variableNameRef] = newVariable;
      state.elementCount = count + 1;
    },

    addProgressBar: (state, action: PayloadAction<undefined>) => {
      const count: number = state.elementCount;
      const variableName = `v${count}`;
      const variableNameRef = `[context.${variableName}]`;
      const newVariable: Variable = {
        name: variableName,
        value: 100,
        isStatic: true,
        sample: undefined,
      };
      state.componentById[count] = {
        ...defaultProgressBar,
        id: count,
        order: 0,
        name: `PB ${count + 1}`,
        value: variableNameRef,
      };
      state.variablesByName[variableNameRef] = newVariable;
      state.elementCount = count + 1;
    },
    addRectangle: (state, action: PayloadAction<undefined>) => {
      const count: number = state.elementCount;
      state.componentById[count] = {
        ...defaultRectangle,
        id: count,
        order: 0,
        name: `Rect ${count + 1}`,
      };
      state.elementCount = count + 1;
    },
    addLine: (state, action: PayloadAction<undefined>) => {
      const count: number = state.elementCount;
      state.componentById[count] = {
        ...defaultLine,
        id: count,
        order: 0,
        name: `Line ${count + 1}`,
      };
      state.elementCount = count + 1;
    },
    deleteComponent: (state, action: PayloadAction<DeleteItemAction>) => {
      delete state.componentById[action.payload.id];
      // this assumes there is only 1 variable per item
      delete state.variablesByName[`v${action.payload.id}`];
    },
    setComponents: (state, action: PayloadAction<Array<ComponentDef>>) => {
      const sortedArray = action.payload.map((v, i) => ({
        ...v,
        order: v.order ?? i,
      }));
      state.componentById = keyBy(sortedArray, 'id');
    },
    setVariables: (state, action: PayloadAction<MapOfVariables>) => {
      const max = Object.values(action.payload).reduce((prev, cur) => {
        const prevAsNumber = parseInt(prev.name.replace(/[^0-9]/g, ''), 10);
        const curAsNumber = parseInt(cur.name.replace(/[^0-9]/g, ''), 10);
        if (prevAsNumber > curAsNumber) {
          return prev;
        }
        return cur;
      });
      const maxVar = parseInt(max.name.replace(/[^0-9]/g, ''), 10);
      state.variablesByName = action.payload;
      state.elementCount = maxVar + 1 ?? 20;
    },
    updateComponent: (state, action: PayloadAction<ComponentDef>) => {
      state.componentById[action.payload.id] = action.payload;
    },
    updateVariable: (state, action: PayloadAction<Variable>) => {
      const oldValue = state.variablesByName[action.payload.name];
      const mutablePayload = action.payload;
      if (
        !(oldValue?.isStatic ?? false) &&
        (action.payload?.isStatic ?? false)
      ) {
        mutablePayload.sample = undefined;
      }
      const variableName = action.payload.name;
      const variableNameRef = `[context.${variableName}]`;

      if (!action.payload.isStatic) {
        // this will evaluate whether what you're writing passes as javascript
        //  which is the evaluation language for SimHub (SH)
        // It doesn't have full context of what you're trying to get from SH
        //  so it's not a guarantee that it will succeed, but if it fails, it
        //  won't work in SH
        try {
          parseScript(action.payload.value.toString());
          state.errorsByVariableName[variableNameRef] = undefined;
        } catch (e: any) {
          console.log(e);
          state.errorsByVariableName[variableNameRef] = e.toString();
        }
      }

      state.variablesByName[variableNameRef] = mutablePayload;
    },
  },
});

export const {
  setComponents,
  setVariables,
  updateComponent,
  updateVariable,
  addLine,
  addRectangle,
  addText,
  addProgressBar,
  deleteComponent,
} = oledSlice.actions;

/**
 * Selectors
 */

export const selectOled = ({ oled }: GlobalState) => oled;

export const selectComponents = ({ oled }: GlobalState) =>
  Object.values(oled.componentById);

export const selectVariablesByName = createSelector(
  [selectOled],
  (oled) => oled.variablesByName
);

export const selectErrorsByVariableName = createSelector(
  [selectOled],
  (oled) => oled.errorsByVariableName
);

export default oledSlice.reducer;
