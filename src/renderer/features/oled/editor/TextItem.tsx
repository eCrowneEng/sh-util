import { useDispatch } from 'react-redux';
import { ComponentDef } from '../../../../constants';
import styles from './Editor.module.scss';
import { EditorProps, makeFieldChangeHandler } from "./common";
import { VariableField } from './VariableField';

export interface TextItemProps {
  fontType: 0 | 1 | 2;
  fontSize: 1 | 2 | 3 | 4 | 5;
  color: 0 | 1 | 2;
  align: 0 | 1 | 2 | 3;
}

export function TextItemForm(
  props: TextItemProps & EditorProps & ComponentDef
) {
  const { oledWidth, oledHeight, ...item } = props;
  const dispatch = useDispatch();
  const onFieldChange = makeFieldChangeHandler(dispatch, item);

  return (
    <>
      <div className={styles.row}>
        <div className={styles.halfField}>
          <label>Font:</label>
          <input
            type="number"
            min={0}
            max={2}
            onChange={onFieldChange}
            name="fontType"
            value={item.fontType ?? 0}
          />
        </div>
        <div className={styles.halfField}>
          <label>Font Size:</label>
          <input
            type="number"
            min={1}
            max={5}
            onChange={onFieldChange}
            name="fontSize"
            value={item.fontSize ?? 1}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.halfField}>
          <label>Color:</label>
          <input
            type="number"
            min={0}
            max={1}
            onChange={onFieldChange}
            name="color"
            value={item.color ?? 1}
          />
        </div>
        <div className={styles.halfField}>
          <label>Align:</label>
          <input
            type="number"
            min={0}
            max={3}
            onChange={onFieldChange}
            name="align"
            value={item.align ?? 0}
          />
        </div>
      </div>
      <VariableField fieldName="text" value={item.text} item={item} />
    </>
  );
}
