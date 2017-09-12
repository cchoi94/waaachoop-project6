import React from 'react'
import ReactDOM from 'react-dom'
import { 
    BrowserRouter as Router, 
    Route, Link, NavLink } from 'react-router-dom';
import firebase from './firebase.js'

const dbRef = firebase.database().ref('/leaderBoard');

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            chops: 0,
            mastery: 0,
            masteryCost: 5,
            tourneysWon: 0,
            tResults: ['win','lose','tie'],
            tResultDescript: '',
            JTCost : 100,
            BLApprovals: 0,
            BLApprovalCost: 5,
            increaseCost: 1.10,
            timer: 360,
            nameValue: '',
            leaderBoardArray: [],
            
        };
        this.handleChopClick = this.handleChopClick.bind(this);
        this.handleMasteryClick = this.handleMasteryClick.bind(this);
        this.handleJTClick = this.handleJTClick.bind(this);
        this.handleBLClick = this.handleBLClick.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    
    componentDidMount() {
        dbRef.on('value', (snapshot) => {
            const leaderBoardArray = [];
            const firebaseItems = snapshot.val();
            for (let key in firebaseItems) {
            const firebaseItem = firebaseItems[key];
            firebaseItem.id = key;
            leaderBoardArray.push(firebaseItem);
            }
            this.setState({
                leaderBoard: leaderBoardArray,    
            })
        });
        
        let timer = this.state.timer;
        let chop = this.state.chops;
        let timerId = setInterval(() => {
                       
            if (this.state.chops !== 0 && timer > 0) {
                timer--;
            } 
            else if (this.state.timer === 0) {
                this.clear(timerId)
            }
            
            this.setState ({ 
                chops: this.state.chops + this.state.mastery * 1,
                timer: timer
            })
        }, 20);
    }
   
    
    clear(timer) {
        clearInterval(timer)
        
        this.setState({
            chops: 0,
        })
        
        let leaderBoard = this.state.leaderBoardArray;
        let name = this.state.nameValue;
        let approvals = this.state.BLApprovals;
        leaderBoard.push({
            name: name,
            score: approvals,
        })
        
        for (let i = 0; i < 5; i++)
        
        dbRef.push(leaderBoard)
    }
    
    handleNameChange(event) {
        this.setState({
            nameValue: event.target.value
        })
    } 
    
    handleNameSubmit(event) {
        document.getElementById('nameForm').reset()
        event.preventDefault();
    }
    
    handleChopClick() {
        let chop = this.state.chops + 1;
        this.setState({
            chops: chop,
        });
    }
    
    handleMasteryClick() {
        let chop = this.state.chops;
        let Mastery = this.state.mastery;
        let cost = this.state.masteryCost;
        let increaseCost = this.state.increaseCost;
        if (chop >= cost) {
            chop = chop - cost;
            cost = cost * increaseCost; 
            Mastery++;    
        }
        
        this.setState({
            chops: Math.floor(chop),
            mastery: Mastery,
            masteryCost: Math.round(cost)
        })
    }
    
    handleJTClick () {
        let chop = this.state.chops;
        let cost = this.state.JTCost;
        let increaseCost = this.state.increaseCost;
        let tourneyWon = this.state.tourneysWon;
        let tResult = this.state.tResults[Math.floor(Math.random()*this.state.tResults.length)];
        let tResultDescript = this.state.tResultDescript;
        if (chop < cost) {
            tResultDescript = 'Do More Chops!';
        }
        else if (chop >= cost && tResult === 'win') {
            chop = chop - cost;
            tourneyWon++;
            tResultDescript = 'You Won!';
        } else if (tResult === 'lose') {
            chop = chop - cost;
            tResultDescript = 'You Lost!';
        } else if (tResult === 'tie') {
            chop = chop - cost;
            tourneyWon = tourneyWon + 0.5;
            tResultDescript = 'You Tied for First!'
        }
        this.setState({
            chops: chop,
            tourneysWon: tourneyWon,
            tResultDescript: tResultDescript,
        })
    }
    
    handleBLClick () {
        let tourneyWon = this.state.tourneysWon;
        let approval = this.state.BLApprovals;
        let approvalCost = this.state.BLApprovalCost;
        if (tourneyWon >= approvalCost) {
            tourneyWon = tourneyWon - approvalCost;
            approval++;
        }
        this.setState({
            tourneysWon: tourneyWon,
            BLApprovals: approval,
        })
    }
    
    
    render() {
        return (
            <div className='app'>
                <header className='landingPage'>
                    <div className='wrapper'>
                        <h1>Waaa<br></br>Chooop!!</h1> 
                        <form className='nameForm' id='nameForm' onSubmit={this.handleNameSubmit}>
                        <input type="text" value={this.nameValue} placeholder="Enter your Name" onChange={this.handleNameChange}></input>
                        <h5>Press Enter to Start</h5>
                        </form>
                    </div>
                </header>
                <div className='container'>
                    <section className='vega'>
                        <input type="submit" value="Chop" onClick={this.handleChopClick}></input>     
                        <input type="submit" value="Progress Chop" onClick={this.handleMasteryClick}></input>          
                        <input type="submit" value="Join Chopping Tournament" onClick={this.handleJTClick}></input>          
                        <input type="submit" value="Bruce Lee Approval" onClick={this.handleBLClick}></input>          
                    </section>
                    <section className='displayAssets'>
                        <ul>
                            <li>Make Every Second Count! {this.state.timer} Chop Seconds Left</li>
                            <li>Chops: {this.state.chops}</li>
                            <li>Chop Mastery: {this.state.mastery} / {this.state.masteryCost} Chops Required!</li>
                            <li>Tournaments Won: {this.state.tourneysWon}</li>
                            <li>Tournament Result: {this.state.tResultDescript}</li>
                            <li>Bruce Lee Approvals: {this.state.BLApprovals}</li>
                        </ul> 
                        <div></div>   
                    </section>
                    <section>
                        
                    </section>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));


// how to stop interval
// 

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

// write a function in the app that when timer state = 0, run swal with score and pic 

// grab the name, grab Bruce Lee Approvals


//        cardGame.newLead = (timer, string) => {
//    let username = 'noName';
//    $('#playerName').empty();
//    if ($('#playerName').val() != "") {
//        username = $('#playerName').val();
//    }
//    cardGame.leadBoard.push({
//        name: username,
//        time: timer,
//        timeString: string
//    })
//}
//
//cardGame.displayLead = () => {
//    cardGame.leadBoard.on("value", (scores) => {
//        let topFive = [];
//        let dataArray = scores.val();
//        let scoresArray = [];
//        let boardString = '<h2>Leaderboard</h2>';
//
//        for (let key in dataArray) {
//            scoresArray.push(dataArray[key]);
//        }
//
//        scoresArray.sort((a, b) => {
//            return a.time - b.time;
//        })
//
//        for (let i = 0; i < 5; i++) {
//            boardString += (`<p>${scoresArray[i].name} : ${scoresArray[i].timeString}</p>`);            
//        }
//        $('.leaderBoard').html(boardString);
//    })
//}