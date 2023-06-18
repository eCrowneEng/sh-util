/* eslint-disable import/prefer-default-export */
import { useDispatch } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import { Button } from 'react-bootstrap';
import { ComponentDef } from '../../../../constants';
import { EditorProps, makeFieldChangeHandler } from './common';
import { RectangleItemForm, RectangleItemProps } from './RectangleItem';
import styles from './Editor.module.scss';
import { ProgressBarItemForm, ProgressBarItemProps } from './ProgressBarItem';
import { TextItemForm, TextItemProps } from './TextItem';
import { LineItemForm, LineItemProps } from './LineItem';
import { deleteComponent } from '../oledReducer';

export function Item(
  props: ComponentDef & EditorProps & Partial<RectangleItemProps>
) {
  const { oledWidth, oledHeight, ...item } = props;
  const dispatch = useDispatch();

  const onFieldChange = makeFieldChangeHandler(dispatch, item);

  return (
    <Accordion.Item
      className={styles.configurator}
      eventKey={item.id.toString()}
    >
      <Accordion.Header>
        {item.name ? <b>{item.name}&nbsp;</b> : ''}
        <em>[{item.componentType}]</em>
      </Accordion.Header>
      <Accordion.Body>
        <div className={styles.row}>
          <div className={styles.thirdField}>
            <label>Name:</label>
            <input
              type="text"
              maxLength={20}
              onChange={onFieldChange}
              name="name"
              placeholder="Unnamed"
              value={item.name ?? ''}
            />
          </div>
          <div className={styles.thirdField}>
            <label>Order:</label>
            <input
              type="number"
              onChange={onFieldChange}
              name="order"
              value={item.order}
            />
          </div>
          <div className={styles.thirdField}>
            <label>Visible:</label>
            <input
              type="checkbox"
              onChange={onFieldChange}
              name="visible"
              checked={item.visible ?? true}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.halfField}>
            <label>X:</label>
            <input
              type="number"
              min={0}
              max={oledWidth * 2}
              onChange={onFieldChange}
              name="x"
              value={item.x}
            />
          </div>
          <div className={styles.halfField}>
            <label>Y:</label>
            <input
              type="number"
              min={0}
              max={oledHeight * 2}
              onChange={onFieldChange}
              name="y"
              value={item.y}
            />
          </div>
        </div>
        {item.componentType.toLowerCase() === 'rectangle' && (
          <RectangleItemForm
            oledWidth={oledWidth}
            oledHeight={oledHeight}
            {...(item as RectangleItemProps & ComponentDef)}
          />
        )}
        {item.componentType.toLowerCase() === 'progressbar' && (
          <ProgressBarItemForm
            oledWidth={oledWidth}
            oledHeight={oledHeight}
            {...(item as ProgressBarItemProps & ComponentDef)}
          />
        )}
        {item.componentType.toLowerCase() === 'text' && (
          <TextItemForm
            oledWidth={oledWidth}
            oledHeight={oledHeight}
            {...(item as TextItemProps & ComponentDef)}
          />
        )}
        {item.componentType.toLowerCase() === 'line' && (
          <LineItemForm
            oledWidth={oledWidth}
            oledHeight={oledHeight}
            {...(item as LineItemProps & ComponentDef)}
          />
        )}
        <div className={styles.row}>
          <div className={styles.field}>
            <Button
              onClick={() => dispatch(deleteComponent({ id: item.id }))}
              variant="danger"
            >
              Delete
            </Button>
          </div>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
}
