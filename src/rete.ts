import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Rete, { NodeEditor } from 'rete';
// @ts-ignore: no declaration file for module
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';

import NumberComponent from './NumberComponent';
import AddComponent from './AddComponent';

const NODE_EDITOR_ID = 'retejs-examples@0.1.0';

export async function createEditor(container: HTMLDivElement) {
  const editor = new Rete.NodeEditor(NODE_EDITOR_ID, container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, {
    createRoot,
  });

  const engine = new Rete.Engine(NODE_EDITOR_ID);

  const allComponents: any = {
    number: new NumberComponent(),
    add: new AddComponent(),
  };
  Object.keys(allComponents).forEach((key) => {
    editor.register(allComponents[key]);
    engine.register(allComponents[key]);
  });

  // create nodes
  const numberNode1 = await allComponents['number'].createNode({ controlKey: '1' });
  const numberNode2 = await allComponents['number'].createNode({ controlKey: '2' });
  const addNode = await allComponents['add'].createNode();
  numberNode1.position = [80, 0];
  numberNode2.position = [80, 200];
  addNode.position = [500, 40];
  editor.addNode(numberNode1);
  editor.addNode(numberNode2);
  editor.addNode(addNode);
  editor.connect(numberNode1.outputs.get('outputKey'), addNode.inputs.get('inputKey1'));
  editor.connect(numberNode2.outputs.get('outputKey'), addNode.inputs.get('inputKey2'));

  editor.view.area.translate(100, 100);

  editor.on(
    // @ts-ignore
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      // console.debug('process', editor.toJSON());
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  editor.trigger('process');

  return editor;
}

export function useRete() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const editorRef = useRef<NodeEditor>();

  useEffect(() => {
    if (container) {
      createEditor(container).then((editor) => {
        console.debug('created', editor);
        editorRef.current = editor;
      });
    }
  }, [container]);

  useEffect(
    () => () => {
      if (editorRef.current) {
        console.debug('destroy rete');
        (editorRef.current as NodeEditor).destroy();
      }
    },
    []
  );

  return [setContainer];
}
