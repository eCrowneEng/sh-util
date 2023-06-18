import './elements/OledRenderer.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { ComponentDef, MapOfVariables } from '../../../constants';
import OledRenderer from './elements/OledRenderer';
import {
  addLine,
  addProgressBar,
  addRectangle,
  addText,
  setComponents,
  setVariables,
} from './oledReducer';
import Editor from './editor/Editor';
import styles from './OledPage.module.scss';
import { AppDispatch } from '../../state/store';

/**
 * Initial state
 */
const initialVariables: MapOfVariables = JSON.parse('{"[context.v5]":{"name":"v5","value":"[DataCorePlugin.GameData.Gear]","isStatic":false,"sample":3},"[context.v6]":{"name":"v6","value":"[DataCorePlugin.GameData.Brake]","isStatic":false,"sample":88},"[context.v7]":{"name":"v7","value":"[DataCorePlugin.GameData.Throttle]","isStatic":false,"sample":99},"[context.v8]":{"name":"v8","value":"[DataCorePlugin.GameData.SpeedLocalUnit]","isStatic":false,"sample":"MPH"},"[context.v9]":{"name":"v9","value":"round([SpeedLocal], 0)","isStatic":false,"sample":39}}');
const initialComponents: Array<ComponentDef> = JSON.parse('[{"text":"[context.v5]","id":5,"fontType":2,"fontSize":2,"color":1,"align":1,"verticalAlign":1,"x":22,"y":56,"visible":1,"order":0,"name":"Gear","componentType":"text"},{"value":"[context.v6]","id":6,"color":1,"x":0,"y":0,"height":64,"width":4,"minValue":0,"maxValue":100,"vertical":"true","reverse":"true","visible":1,"order":0,"name":"Brake","componentType":"progressbar"},{"value":"[context.v7]","id":7,"color":1,"x":124,"y":0,"height":64,"width":4,"minValue":0,"maxValue":100,"vertical":"true","reverse":"true","visible":1,"order":0,"name":"Accel","componentType":"progressbar"},{"text":"[context.v8]","id":8,"fontType":0,"fontSize":1,"color":1,"align":1,"verticalAlign":1,"x":101,"y":55,"visible":1,"order":0,"name":"Units","componentType":"text"},{"text":"[context.v9]","id":9,"fontType":0,"fontSize":3,"color":1,"align":3,"verticalAlign":1,"x":120,"y":31,"visible":1,"order":0,"name":"speed","componentType":"text"}]');

export default function OledPage() {
  const dispatch: AppDispatch = useDispatch();

  // Set initial components
  useEffect(() => {
    if (initialComponents.length > 0) {
      dispatch(setComponents(initialComponents));
    }
    if (Object.values(initialVariables).length > 0) {
      dispatch(setVariables(initialVariables));
    }
  }, [dispatch]);

  const oledHeight = 64;
  const oledWidth = 128;
  const scaleFactor = 4;
  // Offset for the editor to position it below the renderer
  //  because we have to scale it with css
  const marginTop = oledHeight * (scaleFactor - 1);

  return (
    <>
      <OledRenderer
        oledHeight={oledHeight}
        oledWidth={oledWidth}
        previewScaleFactor={scaleFactor}
      />
      <div className={styles.editor} style={{ marginTop }}>
        <ButtonGroup className={styles.dropdown}>
          <DropdownButton as={ButtonGroup} variant="secondary" title="Add Item">
            <Dropdown.Item onClick={() => dispatch(addText())} eventKey="1">
              Text
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => dispatch(addProgressBar())}
              eventKey="2"
            >
              Progress Bar
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => dispatch(addRectangle())}
              eventKey="3"
            >
              Rectangle
            </Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(addLine())} eventKey="4">
              Line
            </Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
        <Editor oledHeight={oledHeight} oledWidth={oledWidth} />
      </div>
    </>
  );
}
