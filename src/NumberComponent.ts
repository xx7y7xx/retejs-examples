import Rete, { Component, Node } from 'rete';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

import InputControl from './InputControl';

export const numberSocket = new Rete.Socket('Number');

export default class NumberComponent extends Component {
  constructor() {
    super('Number');
  }

  async builder(node: Node) {
    node
      .addOutput(new Rete.Output('outputKey', 'number', numberSocket))
      .addControl(new InputControl(this.editor, 'controlKey', node));
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    outputs['outputKey'] = node.data['controlKey'];
  }
}
