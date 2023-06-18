import { useSelector } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import { selectComponents } from '../oledReducer';
import styles from './Editor.module.scss';
import { EditorProps } from './common';
import { Item } from './Item';

export default function Editor(props: EditorProps) {
  const componentDefinitions = useSelector(selectComponents);

  // needs spread operator... sort modifies original array which is readonly
  const configuratorItems = [...componentDefinitions]
    .sort((a, b) => {
      return (a.order ?? 0) - (b.order ?? 0);
    })
    .map((item) => {
      return <Item {...item} {...props} key={item.id} />;
    });
  return (
    <>
      {configuratorItems.length > 0 && (
        <Accordion className={styles.editor}>{configuratorItems}</Accordion>
      )}
      {configuratorItems.length === 0 && (
        <div className={styles.empty}>
          <h2>Empty</h2>
          <h4>Try clicking "Add Item"</h4>
        </div>
      )}
    </>
  );
}
