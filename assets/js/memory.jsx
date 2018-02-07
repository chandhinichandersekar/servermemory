import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import shuffleArray from 'shuffle-array';

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

export default class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getNewGameState();
    }

    getNewGameState() {
        let newGameTiles = [{ letter: "A" }, { letter: "B" }, { letter: "C" }, { letter: "D" }, { letter: "E" }, { letter: "F" }, { letter: "G" }, { letter: "H" },
        { letter: "A" }, { letter: "B" }, { letter: "C" }, { letter: "D" }, { letter: "E" }, { letter: "F" }, { letter: "G" }, { letter: "H" }];
        newGameTiles = shuffleArray(newGameTiles, { 'copy': true });
        newGameTiles = newGameTiles.map((tile, index) => {
            tile.onClick = this.guess.bind(this);
            tile.index = index;
            return tile;
        });
        const newGame = {
            firstGuess: null,
            secondGuess: null,
            clicks: 0,
            tiles: newGameTiles,
            matched: 0,
            win: false
        }
        return newGame;
    }

    initGame() {
        this.setState(this.getNewGameState());
    }

    compareTiles() {
        const firstGuessTile = this.state.tiles[this.state.firstGuess];
        const secondGuessTile = this.state.tiles[this.state.secondGuess];
        return firstGuessTile.letter === secondGuessTile.letter;
    }

    hideTilesAfterDelay() {
        setTimeout(() =>{
            let { tiles, firstGuess, secondGuess } = this.state;
            tiles[firstGuess].show = false;
            tiles[secondGuess].show = false;
            this.setState({tiles});
            this.resetGuess();
        }, 1000);
    }

    resetGuess() {
        let {firstGuess, secondGuess} = this.state;
        firstGuess = null;
        secondGuess = null;
        this.setState({ firstGuess, secondGuess });
    }

    createRow({ start, end }) {
        return this.state.tiles.slice(start, end).map((tile, index) => {
            return (<Tile letter={tile.letter} index={tile.index} matched={tile.matched} onClick={tile.onClick} key={index} show={tile.show} />);
        })
    }

    addClick() {
        let { clicks } = this.state;
        clicks = clicks + 1;
        this.setState({clicks});
    }

    incrementMatchCount() {
        let {matched} = this.state;
        matched = matched + 2;
        this.setState({matched, win: this.checkIfWin(matched)});
    }

    checkIfWin(matched) {
        return matched === this.state.tiles.length;
    }

    guessIndexMatch(index) {
        return this.state.firstGuess === index;
    }

    setGuessesToMatched(){
        let { tiles } = this.state;
        tiles[this.state.firstGuess].matched = true;
        tiles[this.state.secondGuess].matched = true;
        this.setState({tiles});
    }
    guess(index) {
        let { tiles, clicks } = this.state;
        if (this.state.tiles[index].matched){
          return;
        }
        if (this.state.firstGuess === null) {
            this.addClick();
            this.setState({ firstGuess: index });
            tiles[index].show = true;
            this.setState({ tiles }, function () {
            });

        } else if (this.state.secondGuess === null) {
            if(!this.guessIndexMatch(index)){
                this.addClick();
                this.setState({ secondGuess: index }, () => {
                    if (this.compareTiles()) {
                        this.resetGuess();
                        this.setGuessesToMatched();
                        this.incrementMatchCount();
                    } else {
                        this.hideTilesAfterDelay();
                    }
                });
                tiles[index].show = true;
                this.setState({ tiles });
            }

        }


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
