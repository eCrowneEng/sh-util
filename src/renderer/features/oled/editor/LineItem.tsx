import { useDispatch } from 'react-redux';
import { ComponentDef } from '../../../../constants';
import styles from './Editor.module.scss';
import { EditorProps, makeFieldChangeHandler } from "./common";

export interface LineItemProps {
  x2: number;
  y2: number;
  colorType: 0 | 1 | 2;
}

export function LineItemForm(
  props: LineItemProps & EditorProps & ComponentDef
) {
  const { oledWidth, oledHeight, ...item } = props;
  const dispatch = useDispatch();
  const onFieldChange = makeFieldChangeHandler(dispatch, item);

  return (
    <>
      <div className={styles.row}>
        <div className={styles.halfField}>
          <label>X2:</label>
          <input
            type="number"
            min={0}
            max={oledWidth * 2}
            onChange={onFieldChange}
            name="x2"
            value={item.x2 ?? 0}
          />
        </div>
        <div className={styles.halfField}>
          <label>Y2:</label>
          <input
            type="number"
            min={0}
            max={oledWidth * 2}
            onChange={onFieldChange}
            name="y2"
            value={item.y2 ?? 1}
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
      </div>
    </>
  );
}
