import Rete, { Component, Node } from 'rete';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

import InputControl from './InputControl';
import { numberSocket } from './NumberComponent';
import { MyNode } from './MyNode';

export default class AddComponent extends Component {
  data: {
    component: any;
  } = { component: MyNode };

  constructor() {
    super('Add');
  }

  async builder(node: Node) {
    const input1 = new Rete.Input('inputKey1', 'Number 1', numberSocket);
    const input2 = new Rete.Input('inputKey2', 'Number 2', numberSocket);

    // add a Control to the Input, so when there is no connection to this Input, the Control is shown
    input1.addControl(new InputControl(this.editor, 'inputKey1', node));
    input2.addControl(new InputControl(this.editor, 'inputKey2', node));

    node.addInput(input1).addInput(input2).addControl(new InputControl(this.editor, 'controlKey', node));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    const n1 = Number(inputs['inputKey1'].length ? inputs['inputKey1'][0] : node.data['inputKey1']);
    const n2 = Number(inputs['inputKey2'].length ? inputs['inputKey2'][0] : node.data['inputKey2']);

    const sum = n1 + n2;

    (this.editor?.nodes?.find((n) => n.id === node.id)?.controls.get('controlKey') as InputControl)?.setValue(String(sum));
  }
}
