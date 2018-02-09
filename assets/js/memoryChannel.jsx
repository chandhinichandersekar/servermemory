import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import MemoryGame from './memory';

export default function game_init(root, channel) {
  ReactDOM.render(<MemoryChannel channel={channel} />, root);
}

class MemoryChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    props.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });
  }

  gotView(view) {
    this.setState({memory: view.memory})
  }

  render() {
    let MemoryGameComponent = null;
    if (this.state.memory) {
      MemoryGameComponent = <MemoryGame initialState={this.state.memory} channel={this.channel}/>;
    }
    return (
      <div>

      {MemoryGameComponent}

      </div>
    );
  }
}
