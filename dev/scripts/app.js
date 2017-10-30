import React from 'react'
import ReactDOM from 'react-dom'
import { 
    BrowserRouter as Router, 
    Route, Link, NavLink } from 'react-router-dom';
import firebase from './firebase.js'
import swal from 'sweetalert'

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
            nameValue: 'Unknown',
            leaderBoard: [],
            booVarLand: false,
            booVarChop: false,
            
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
            const newLeaderBoardArray = [];
            newLeaderBoardArray.sort((a, b) => {
                return a.score - b.score;
            });
            const firebaseItems = snapshot.val();
            for (let key in firebaseItems) {
            const firebaseItem = firebaseItems[key];
            firebaseItem.id = key;
            newLeaderBoardArray.push(firebaseItem);
            }
            this.setState({
                leaderBoard: newLeaderBoardArray,    
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
        }, 500);
    }
   
    
    clear(timer) {
        clearInterval(timer)
        
        this.setState({
            chops: 0,
        })
        
        
        let newLeaderBoard = {
            score: this.state.BLApprovals,
            user: this.state.nameValue
        }
                
        dbRef.push(newLeaderBoard)
    }
    
    handleNameChange(event) {
        this.setState({
            nameValue: event.target.value
        })
    } 
    
    handleNameSubmit(event) {
        let name = this.state.nameValue
        swal({
            title: `Welcome ${this.state.nameValue} to Waaa Chooop Dojo!`,
            text: `Chops are life! Gain chops by clicking! 
            Gain Mastery as you chop and in return, mastery will help you chop faster! 
            Finally, join tournaments with every 100 chops and ever 5 tournament wins will gain you approvals from Bruce Lee! Prove yourself
            on The Chopping Board.`,
        });
        event.preventDefault();
        document.getElementById('nameForm').reset()
        this.setState({
            booVarLand: !this.state.booVarLand,
        })
    }
    
    handleChopClick(e) {
        let chop = this.state.chops + 1;
            this.setState({
                chops: chop,
                booVarChop: !this.state.booVarChop,
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
        let spriteClass = (this.state.booVarChop) ? null : 'spriteOne';
        let hideLanding = (this.state.booVarLand) ? 'hidden' : 'landingPage';
        
        
        return (
            <div className='app'>
                <header className={hideLanding}>
                    <div className='wrapper'>
                        <h1>Waaa<br></br>Chooop!!</h1> 
                        <form className='nameForm' id='nameForm' onSubmit={this.handleNameSubmit} >
                        <input type="text"  value={this.nameValue} placeholder="Enter your Name" onFocus={(e) => e.target.placeholder = ""} 
                        onBlur={(e) => e.target.placeholder = "Enter your Name"} onChange={this.handleNameChange}></input>
                        <h5>Press Enter to Start</h5>
                        </form>
                    </div>
                </header>
                <section className='game'>
                    <div className='wrapper'>
                        <div className='timer'>
                            <h2>Time:{this.state.timer} Chop Secs</h2>
                        </div>
                            <div className='gameBoard'>
                                < div className = 'TCBox clearfix' >
                                    <div className='chopText'>
                                        <div className='chops'>
                                            <h3>Chops <br></br> {this.state.chops}</h3>
                                        </div>
                                        <div className='mastery'>
                                            <h3>Mastery <br></br> {this.state.mastery}</h3>
                                            <h3>Cost: {this.state.masteryCost} Chops </h3>
                                        </div>
                                    </div>
                                            <input type="submit" value="Progress Chop" onClick={this.handleMasteryClick}></input>          
                                    <div className={spriteClass} onClick={this.state.HandleChopClick}></div>
                                    <div className='spriteTwo'></div>
                                </div>
                                <div className='ATBox'>
                                    <div className='tourney'>
                                        <h3>Tournaments Won: {this.state.tourneysWon} <br></br> Cost: 100 Chops</h3>
                                        <input type="submit" value="Join Chopping Tournament" onClick={this.handleJTClick}></input>
                                        <h3>Tournament Result: <br></br> {this.state.tResultDescript}</h3>
                                    </div>
                                    <div className='approval'>
                                        <h3>Bruce Lee Approvals: {this.state.BLApprovals} <br></br> Cost: 5 Tourney Wins</h3>
                                        <input type='submit' value="Bruce Lee Approval" onClick={this.handleBLClick}></input>          
                                    </div>
                                </div>
                            </div>
                        <input className='chopClick' type='submit' value='Chop' onClick={this.handleChopClick}></input>     
                    </div>
                </section>
                    <section className='leaderBoard'>
                        <div className='wrapper'>
                           <h1>The Chopping Board</h1>
                                {this.state.leaderBoard.map((item) => {
                                    return (
                                        <div className='LBResults'>
                                            <h3>{item.user}</h3>
                                            <h3>{item.score}</h3>
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));