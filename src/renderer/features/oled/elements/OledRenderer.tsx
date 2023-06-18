import { Stage, Layer } from 'react-konva';
import './OledRenderer.css';
import { useEffect, useRef } from 'react';
import useFontFaceObserver from 'renderer/lib/usefontfaceobserver';
import { useSelector } from 'react-redux';
import { from as textFrom, TextConfigType } from './SHText';
import { from as rectFrom, RectangleConfigType } from './SHRectangle';
import { from as lineFrom, LineConfigType } from './SHLine';
import {
  from as progressBarFrom,
  ProgressBarConfigType,
} from './SHProgressBar';
import { ComponentDef, MapOfVariables } from '../../../../constants';
import { selectComponents, selectVariablesByName } from '../oledReducer';

function toComponent(
  component: ComponentDef,
  variables: MapOfVariables,
  index: number
) {
  switch (component.componentType.toLowerCase()) {
    case 'text':
      return textFrom(component as TextConfigType, variables, index);
    case 'rectangle':
      return rectFrom(component as RectangleConfigType, index);
    case 'line':
      return lineFrom(component as LineConfigType, index);
    case 'progressbar':
      return progressBarFrom(
        component as ProgressBarConfigType,
        variables,
        index
      );
    case 'map':
      return null;
    case 'offset':
      return null;
    case 'resetoffset':
      return null;
    case 'include':
      return null;
    default:
      return null;
  }
}

function compareComponentDef(a: ComponentDef, b: ComponentDef) {
  return (a.order ?? Number.MAX_VALUE) - (b.order ?? Number.MAX_VALUE);
}

interface OledRendererProps {
  oledWidth: number;
  oledHeight: number;
  previewScaleFactor: number;
}

export default function OledRenderer(props: OledRendererProps) {
  const {
    oledHeight: heightPixels,
    oledWidth: widthPixels,
    previewScaleFactor: scaleFactor,
  } = props;
  const layerRef = useRef<HTMLDivElement>(null);
  const areFontsLoaded = useFontFaceObserver(
    [{ family: 'Apple II' }, { family: 'Open 24 ST' }],
    { timeout: 3000 },
    { showErrors: true }
  );

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.style.transform = `translateY(${
        (heightPixels / 2) * (scaleFactor - 1)
      }px)`;
      const canvas = layerRef.current.querySelector('canvas');
      if (canvas) {
        canvas.width = widthPixels;
        canvas.height = heightPixels;
      }
      const container: HTMLElement | null =
        layerRef.current.querySelector('.oled');
      if (container) {
        container.style.transform = `scale(${scaleFactor})`;
      }
    }
  }, [heightPixels, scaleFactor, widthPixels]);
  const componentDefinitions = useSelector(selectComponents);
  const mapOfVariables = useSelector(selectVariablesByName);

  const renderComponent = (
    schema: ComponentDef[],
    variables: MapOfVariables
  ) => {
    const components = Array.from(schema)
      .sort(compareComponentDef)
      .map((componentDef, i) => toComponent(componentDef, variables, i));
    return areFontsLoaded ? components : null;
  };

  return (
    <div style={{ display: 'flex' }} ref={layerRef}>
      <Stage className="oled" width={widthPixels} height={heightPixels}>
        <Layer>{renderComponent(componentDefinitions, mapOfVariables)}</Layer>
      </Stage>
    </div>
  );
}
