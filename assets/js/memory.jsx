import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import shuffleArray from 'shuffle-array';

export default class Demo extends React.Component {

    constructor(props) {
      super(props);
      this.state = this.getNewGameState(this.props.initialState);
      console.log("memory jsx", this.state);
    }

    getNewGameState(newState) {
      let firstGuess = null;
      let secondGuess = null;
      let clicks = 0;
      let matched = 0;
      let win = false;
      let newGameTiles = [{ letter: "A" }, { letter: "B" }, { letter: "C" }, { letter: "D" }, { letter: "E" }, { letter: "F" }, { letter: "G" }, { letter: "H" },
      { letter: "A" }, { letter: "B" }, { letter: "C" }, { letter: "D" }, { letter: "E" }, { letter: "F" }, { letter: "G" }, { letter: "H" }];
      if (newState) {
        clicks = newState.clicks;
        firstGuess = newState.firstGuess;
        secondGuess =  newState.secondGuess;
        newGameTiles = newState.tiles;
        matched = newState.matched;
        win = newState.win;
      }
        newGameTiles = newGameTiles.map((tile, index) => {
            tile.onClick = this.guess.bind(this);
            tile.index = index;
            return tile;
        });
        const newGame = {
            firstGuess,
            secondGuess,
            clicks,
            tiles: newGameTiles,
            matched,
            win
        }
        return newGame;
    }

    initGame() {
      if (this.props.channel){
        this.props.channel.push("resetGame")
        .receive("ok", response => {
          const newState = this.getNewGameState(response.newState)
          this.setState(newState);
        });
      }
      else {
          this.setState(this.getNewGameState());
        }
    }


    createRow({ start, end }) {
        return this.state.tiles.slice(start, end).map((tile, index) => {
            return (<Tile letter={tile.letter} index={tile.index} matched={tile.matched} onClick={tile.onClick} key={index} show={tile.show} />);
        })
    }


    resetGuess() {
          this.props.channel.push("resetGame")
          .receive("ok", response => {
            const newState = this.getNewGameState(response.newState)
            this.setState(newState);
          })
    }

    delayHide(hide) {
      if (hide) {
        setTimeout(() => {
          this.props.channel.push("hideGuesses")
          .receive("ok", response => {
            const newState = this.getNewGameState(response.newState)
            this.setState(newState);
          })
        }, 1000);
      }
    }

    guess(index) {
          this.props.channel.push("guessMemory", {index})
            .receive("ok", response => {
              const newState = this.getNewGameState(response.newState)
              this.delayHide(response.newState.hide)
              this.setState(newState);
            });
    }

    render() {
        var cardStyle = {
            width: "6rem",
            height: "6rem",
        };
        const winText = this.state.win ? "YOU WIN!!!" : "";

        return (
            <div className="container">
            <h1> {winText} </h1>
                <div className="row">
                    {this.createRow({ start: 0, end: 4 })}
                </div>
                <div className="row">
                    {this.createRow({ start: 4, end: 8 })}
                </div>
                <div className="row">
                    {this.createRow({ start: 8, end: 12 })}
                </div>
                <div className="row">
                    {this.createRow({ start: 12, end: 16 })}
                </div>
                  <h1> SCORE: {this.state.clicks} </h1>
                  <button onClick={this.initGame.bind(this)}> New Game </button>
            </div>
        );
    }
}

class Tile extends React.Component {

    onTileClick() {
        this.props.onClick(this.props.index);
    }

    render() {
        const nullOrMatched = this.props.matched ? <a>Matched</a> : null;
        const letterElement = <a> {this.props.letter} </a>;
        const letterText = this.props.show && !this.props.matched ? letterElement : "";
        const flipColor = this.props.matched ? "green" : "blue";
        var cardStyle = {
            width: "6rem",
            height: "6rem",
            backgroundColor: flipColor
        };

        return (
            <div className="col">
                <div onClick={this.onTileClick.bind(this)} className="card text-white mb-3" style={cardStyle}>
                    <center>
                        <h1> {letterText} </h1>
                        {nullOrMatched}
                    </center>
                </div>
            </div>
        );
    }
}
