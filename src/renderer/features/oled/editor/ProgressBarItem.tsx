import { useDispatch } from 'react-redux';
import { ComponentDef } from '../../../../constants';
import styles from './Editor.module.scss';
import { EditorProps, makeFieldChangeHandler } from "./common";
import { VariableField } from "./VariableField";

export interface ProgressBarItemProps {
  width: number;
  height: number;
  color: 0 | 1;
  minValue: number;
  maxValue: number;
  reverse: number;
  vertical: number;
}

export function ProgressBarItemForm(
  props: ProgressBarItemProps & EditorProps & ComponentDef
) {
  const { oledWidth, oledHeight, ...item } = props;
  const dispatch = useDispatch();
  const onFieldChange = makeFieldChangeHandler(dispatch, item);

  return (
    <>
      <div className={styles.row}>
        <div className={styles.halfField}>
          <label>Width:</label>
          <input
            type="number"
            min={1}
            max={oledWidth * 2}
            onChange={onFieldChange}
            name="width"
            value={item.width ?? 1}
          />
        </div>
        <div className={styles.halfField}>
          <label>Height:</label>
          <input
            type="number"
            min={1}
            max={oledHeight * 2}
            onChange={onFieldChange}
            name="height"
            value={item.height ?? 1}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.thirdField}>
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
        <div className={styles.thirdField}>
          <label>Min Value:</label>
          <input
            type="number"
            onChange={onFieldChange}
            name="minValue"
            value={item.minValue ?? 0}
          />
        </div>
        <div className={styles.thirdField}>
          <label>Max Value:</label>
          <input
            type="number"
            onChange={onFieldChange}
            name="maxValue"
            value={item.maxValue ?? 0}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.thirdField}>
          <label>Reverse:</label>
          <input
            type="checkbox"
            onChange={onFieldChange}
            name="reverse"
            checked={item.reverse ? Boolean(item.reverse) : false}
          />
        </div>
        <div className={styles.thirdField}>
          <label>Vertical:</label>
          <input
            type="checkbox"
            onChange={onFieldChange}
            name="vertical"
            checked={item.vertical ? Boolean(item.vertical) : false}
          />
        </div>
      </div>
      <VariableField fieldName="value" value={item.value} item={item} />
    </>
  );
}
