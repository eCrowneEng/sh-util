import { useDispatch } from 'react-redux';
import { ComponentDef } from '../../../../constants';
import { EditorProps, makeFieldChangeHandler } from "./common";
import styles from './Editor.module.scss';

export interface RectangleItemProps {
  width: number;
  height: number;
  color: 0 | 1 | 2;
  cornerRadius: number;
}

export function RectangleItemForm(
  props: RectangleItemProps & EditorProps & ComponentDef
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
            value={item.width}
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
            value={item.height}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.halfField}>
          <label>Corner Radius:</label>
          <input
            type="number"
            min={0}
            max={(oledHeight * 2 ?? 2) / 2}
            onChange={onFieldChange}
            name="cornerRadius"
            value={item.cornerRadius ?? 0}
          />
        </div>
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
      </div>
    </>
  );
}
