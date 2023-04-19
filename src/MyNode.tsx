import { Node, Socket, Control } from 'rete-react-render-plugin';
import { Control as ControlType } from 'rete/types/control';
import { Node as NodeType } from 'rete/types/node';
import { IO } from 'rete/types/io';

interface MyNodeProps {
  node: NodeType;
  bindSocket: (el: HTMLElement, type: string, io: IO) => void;
  bindControl: (el: HTMLElement, control: ControlType) => void;
}

interface MyNodeState {
  outputs: unknown[];
  controls: ControlType[];
  inputs: unknown[];
  selected: string;
}

const customStyle = {
  background: '#aaa',
  border: 'red dashed 4px',
};

export class MyNode extends Node {
  props!: MyNodeProps;
  state: MyNodeState = {
    outputs: [],
    controls: [],
    inputs: [],
    selected: '',
  };

  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    return (
      <div className={`node ${selected}`} style={customStyle}>
        <div className='title'>{node.name}</div>
        {/* Outputs */}
        {outputs.map((output: any) => (
          <div className='output' key={output.key}>
            <div className='output-title'>{output.name}</div>
            <Socket type='output' socket={output.socket} io={output} innerRef={bindSocket} />
          </div>
        ))}
        {/* Controls */}
        {controls.map((control: any) => (
          <Control className='control' key={control.key} control={control} innerRef={bindControl} />
        ))}
        {/* Inputs */}
        {inputs.map((input: any) => (
          <div className='input' key={input.key}>
            <Socket type='input' socket={input.socket} io={input} innerRef={bindSocket} />
            {!input.showControl() && <div className='input-title'>{input.name}</div>}
            {input.showControl() && <Control className='input-control' control={input.control} innerRef={bindControl} />}
          </div>
        ))}
      </div>
    );
  }
}
