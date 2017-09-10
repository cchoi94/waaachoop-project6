import React from 'react'
import ReactDOM from 'react-dom'
import { 
    BrowserRouter as Router, 
    Route, Link, NavLink } from 'react-router-dom';
import { ajax } from 'jquery';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            chops: 0,
            mastery: 0,
            tourneysWon: 0,
            tResults: ['win','lose'],
            tResultDescript: '',
            standardCost: 40,
            
        };
        this.handlechopClick = this.handlechopClick.bind(this);
        this.handleMasteryClick = this.handleMasteryClick.bind(this);
        this.handleJTClick = this.handleJTClick.bind(this);
        
    console.log(this.state.tResults);
    }
    handlechopClick() {
        let chop = this.state.chops + 40;
        this.setState({
            chops: chop,
        });
    }
    
    handleMasteryClick() {
        let chop = this.state.chops;
        let Mastery = this.state.mastery;
        let cost = this.state.standardCost;
        if (chop >= cost) {
            chop = chop - cost;    
            Mastery++;    
        }

        this.setState({
            chops: chop,
            mastery: Mastery
        })
    }
    
    componentDidMount() {
        setInterval(() => {
            this.setState ({ 
                chops: this.state.chops + this.state.mastery * 1
            }) }, 1000);
        }
    
    handleJTClick () {
        let chop = this.state.chops;
        let cost = this.state.standardCost;
        let tourneyWon = this.state.tourneysWon;
        let tResult = this.state.tResults[Math.floor(Math.random()*this.state.tResults.length)];
        let tResultDescript = this.state.tResultDescript;
        console.log(tResult);
        if (chop < cost) {
            tResultDescript = 'Do More Chops!'
        }
        else if (chop >= cost && tResult === 'win') {
            chop = chop - cost;
            tourneyWon++;
            tResultDescript = 'You Won!';
        } else if (tResult === 'lose') {
            chop = chop - cost;
            tResultDescript = 'You Lost!';
        }
        this.setState({
            chops: chop,
            tourneysWon: tourneyWon,
            tResultDescript: tResultDescript
        })
    }

    render() {
        return (
            <div className='app'>
                <header>
                    <div className='wrapper'>
                        <h1>Waaa Chooop!!!</h1>
                    </div>
                </header>
                <div className='container'>
                    <section className='vega'>
                        <input type="submit" value="Chop" onClick={this.handlechopClick}></input>     
                        <input type="submit" value="Progress Chop" onClick={this.handleMasteryClick}></input>          
                        <input type="submit" value="Join Chopping Tournament" onClick={this.handleJTClick}></input>          
                    </section>
                    <section className='displayAssets'>
                        <ul>
                            <li>Chops: {this.state.chops}</li>
                            <li>Chop Mastery: {this.state.mastery}</li>
                            <li>Tournaments Won: {this.state.tourneysWon}</li>
                            <li>Tournament Result: {this.state.tResultDescript}</li>
                        </ul>    
                    </section>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

// Buttons add plus one iResource whenever it is clicked
// if iResources are greater or equal to 10
// then the user is allowed to spend 10 iResource to get 1 RResource

// when 10 RResources are accumulated
// user is allowed to buy one gResource
// 1 gResources adds 1 iResource with a set interval of 1000ms

// mResource = 50 iResources
// mResources are used to get lVillage
// To attempt to get 1 lVillage costs a minimum of 10 mResource
// input the number of mResource you would like to commit to a lVillage
// if 10 resources are committed then there is a 50% chance of true
// each extra 1 mResources committed adds an extra 5% to success rate

// After time or limit of turns end, then game ends
// the number of villages liberated would be posted on firebase on a leaderboard


// Chops, Mastery(gives clicks), spend chops to fight tournment, 5 tournament wins get 1 bruce lee 