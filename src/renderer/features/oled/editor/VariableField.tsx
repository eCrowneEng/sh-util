import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';
import styles from './Editor.module.scss';
import { makeFieldChangeHandlerForVariable } from './common';
import { ComponentDef } from '../../../../constants';
import {
  selectErrorsByVariableName,
  selectVariablesByName,
} from '../oledReducer';

export function VariableField({
  item,
  fieldName,
  value,
}: {
  item: ComponentDef;
  fieldName: string;
  value: string;
}) {
  const dispatch = useDispatch();
  const variablesByName = useSelector(selectVariablesByName);
  const variable = variablesByName[value];
  const onFieldChange = makeFieldChangeHandlerForVariable(dispatch, variable);
  const errorsByName = useSelector(selectErrorsByVariableName);
  const error = errorsByName[value];
  const isStatic = variable?.isStatic ?? false;
  if (!variable) {
    return null;
  }

  return (
    <div className={styles.frame}>
      <h4>{fieldName}</h4>
      <div className={styles.row}>
        <div className={styles.halfField}>
          <label>Is Static Value:</label>
          <input
            type="checkbox"
            onChange={onFieldChange}
            name="isStatic"
            checked={variable.isStatic ?? false}
          />
        </div>
        {!isStatic && (
          <div className={styles.halfField}>
            <label>Sample Value:</label>
            <input
              className={!variable.sample ? styles.error : undefined}
              type="text"
              onChange={onFieldChange}
              name="sample"
              value={variable.sample}
            />
          </div>
        )}
        {isStatic && (
          <div className={styles.halfField}>
            <label>Static Value:</label>
            <input
              type="text"
              onChange={onFieldChange}
              name="value"
              value={variable.value ?? 1}
            />
          </div>
        )}
      </div>
      {!isStatic && (
        <>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Value (formula):</label>
              <input
                className={error ? styles.error : undefined}
                type="text"
                onChange={onFieldChange}
                name="value"
                value={variable.value ?? 1}
              />
            </div>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
        </>
      )}
    </div>
  );
}
