import React from 'react';
import Wordlist from '../lib/dictionary.json'

const CanvasHeight = 600;
const speedy = 40;
const GAMEWIN = 1;
const GAMELOSE = -1;
const GAMEACTIVE = 0;

class canvasword {
	constructor(word, key){
		this.value = word;
		this.display = word.l;
		this.key = key;
		this.speedx = 0;
	}
}

class GameCanvas extends React.Component
{
	targets(){
		const {wordlist} = this.props;
		let left = Math.floor(Math.random()*800%800);
		return wordlist.map(w => <div key={w.key} style={({position: "relative", left, top: this.props.posy})}>{w.display}</div>);
	}

	render(){
		const {posy} = this.props;
		return <div style={({height:CanvasHeight, width: 800, background: "blue"})}>
			Canvas {posy}
			<div>{this.props.str}</div>
{this.targets()} 
			</div> ;
	}
}

const LeftBar = ( {wl} ) => {
	const Items = wl.map(e => <li key={e.l}>{e.l}</li>);
	return <div><h3>WordList</h3><div><ol>{Items}</ol></div></div>;
};


const Appg = ({ title }) =>
	<div><LeftBar wl={Wordlist.Wordlist} />
  <div><GameCanvas wordlist={Wordlist.Wordlist} />{title}</div></div>;

class GameState {
	constructor(){
		this.reset();
		this.randomize();
	}

	randomize(){
		const len = 2;
		this.wordbag = Wordlist.Wordlist.slice(0, len).map((v, k) => new canvasword(v, k))
	}

	get display(){
		return Object.assign({}, this);
	}

	tic(){
		let {posy} = this;
		posy = posy + speedy;
		this.posy = posy;
	}

	match(){
		const lstr = this.str.toLowerCase();
		const e = this.wordbag.map(wb => wb.display.toLowerCase()).findIndex(v => v == lstr);

		if(e == -1) return false;	// nothing to do

		this.wordbag.splice(e, 1);
		return true;
	}

	reset(){
		this.str = "";
		this.wordbag = [];
		this.posy = -1*speedy;
	}

	get isWinner(){
		return this.wordbag.length == 0;
	}

}

class App extends React.Component
{
	constructor(props){
		super(props);
		document.addEventListener('keyup', (e) => this.catchkey(e));
		this.gamestate = new GameState();
		this.state = { tics: 0, win: 0};

		const a = this;
		function frame(init){
			if(!init){
			a.gamestate.tic();
			a.tic();
			}
			// setTimeout(frame, 1000);
			setTimeout(frame, 300);
		}
		frame(true);
	}

	tic(schedu){
		const {tics} = this.state;
		this.setState({tics: tics+1});
		if(this.gamestate.posy > CanvasHeight){
			this.win(GAMELOSE);
		}
	}

	win(win){
		this.setState({win});
	}

catchkey({key}){
	let {str} = this.gamestate;
	if(key == 'Backspace'){
		str = "";
	}
	if(key.length == 1)
	   str = str + key;

	this.gamestate.str = str;

	if(this.state.win){
		this.gamestate.reset();
		this.gamestate.randomize();
		this.win(GAMEACTIVE);	// reset
		this.tic();
		return;
	}
	if(this.gamestate.match())
	{
		if(this.gamestate.isWinner){
			this.win(GAMEWIN);
		}else{
		this.gamestate.reset();
		this.gamestate.randomize();
		}
	}
	this.tic();
}	

	loseScreen(){
		return <div><h1>You Lose</h1></div>;
	}
	winScreen(){
		return <div><h1>You Win</h1></div>;
	}

	render(){
		const {gamestate} = this;
// <LeftBar wl={Wordlist.Wordlist} />
		if(this.state.win == GAMELOSE)
			return this.loseScreen();
		if(this.state.win == GAMEWIN)
			return this.winScreen();
	return <div>
		<GameCanvas posy={gamestate.posy} str={gamestate.str} wordlist={gamestate.wordbag} /></div>;
	}
}


export default App;
