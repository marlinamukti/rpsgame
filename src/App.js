import React from 'react';
import './App.css';
// import io from 'socket.io-client'

var mqtt = require('mqtt');
var options = {
	protocol: 'mqtt',
  clientId: `${Math.floor(Math.random() * 100)}`,
  port: 8000
};
var client  = mqtt.connect('ws://broker.mqttdashboard.com:8000/mqtt', options);
// client.subscribe('rpsgame')

// client.on('rpsgame', (topic, message) =>{
//   console.log(message)
// })

// var socket = io("http://192.168.1.5:3002/")
// socket.on('connect', function(){
//   console.log('connected')
// })
client.subscribe('rpsgame')

var initState = {
  case: ["👊", "🖐", "✌"]
}

var timer1, timer2;

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      player1: "",
      player2: "",
      value1:-1,
      value2:-1,
      score1: 0,
      score2: 0,
      result: "",
      countdown: 3,
      start1: 0,
      start2: 0,
      currentPlayer:"",
      round1:0,
      round2:0
    }
  }
  


  componentDidMount(){
    client.on('message', (topic, message) => {

      if(topic === "rpsgame"){
        let msg = message.toString().split(":")

        if(msg[0] === "start1"){
          this.setState({
            start1:1
          }, () => {
            this.random1()
          })
        }
        if(msg[0] === "start2"){
          this.setState({
            start2:1
          }, () => {
            this.random2()
          })
        }

        if(msg[0] === "1"){
          if(msg[1] === "rock"){
            clearTimeout(timer1)
            this.setState({
              player1: initState.case[0],
              value1:0
            }, () => {
                this.printScore()
            })
          }
          else if(msg[1] === "paper"){
            clearTimeout(timer1)
            this.setState({
              player1: initState.case[1],
              value1:1
            }, () => {
              this.printScore()
            })
          }
          else if(msg[1] === "scissor"){
            clearTimeout(timer1)
            this.setState({
              player1:initState.case[2],
              value1:2
            }, () => {
              this.printScore()
            })
          }
        }
        if(msg[0] === "2"){
          if(msg[1] === "rock"){
            clearTimeout(timer2)
            this.setState({
              player2: initState.case[0],
              value2:0
            }, () => {
              this.printScore()
            })
          }
          else if(msg[1] === "paper"){
            clearTimeout(timer2)
            this.setState({
              player2: initState.case[1],
              value2:1
            }, () => {
              this.printScore()
            })
          }
          else if(msg[1] === "scissor"){
            clearTimeout(timer2)
            this.setState({
              player2:initState.case[2],
              value2:2
            }, () => {
              this.printScore()
            })
          }
        }


        // if(msg[0] === "score1"){
        //   this.setState({
        //     score1: msg[1]
        //   })
        // }
        // if(msg[0] === "score2"){
        //   this.setState({
        //     score2: msg[1]
        //   })
        // }

        if(msg[0] === "next1"){
          let round1 = msg[1]
          this.setState({
            // player1:"",
            // value1:-1,
            round1: round1
          })
        }
        if(msg[0] === "next2"){
          let round2 = msg[1]
          this.setState({
            // player2:"",
            // value2:-1, 
            round2: round2
          })
        }

        if(msg[0] === "random1"){
          let value1 = msg[1]
          let player1 = msg[2]
          this.setState({
            value1: value1,
            player1: player1
          }, () => this.printScore())
        }

        if(msg[0] === "random2"){
          let value2 = msg[1]
          let player2 = msg[2]
          this.setState({
            value2: value2,
            player2: player2
          }, () => this.printScore())
        }

      }
      

    })

    let search = window.location.search
    let param = new URLSearchParams(search)
    let player = param.get('player')

    if(player === "1"){
      // console.log(player)
      this.setState({
        currentPlayer: player
      })
    }
    if(player === "2"){
      this.setState({
        currentPlayer: player
      })
    }

  }

  

  onChoose = () => {
    let index1 = Math.floor(Math.random() * 3)
    let game1 = initState.case[index1]
    
    this.setState({
      player1: game1,
      player2: ". . ."
    })

    setTimeout(() => {
      let index2 = Math.floor(Math.random() * 3)
      let game2 = initState.case[index2]
      this.setState({
        player2: game2
      })
    }, 2000);
  }

  chooseStart1 = () => {
    client.publish('rpsgame', 'start1')
    // this.setState({
    //   start1: 1
    // }, () => {
    //   timer1 = setTimeout(() => {
    //     let value1 = Math.floor(Math.random() * 3)
    //     let player1 = initState.case[value1]
    //     this.setState({
    //       value1: value1,
    //       player1: player1
    //     }, () => this.printScore())
    //   }, 3000);
    // })
  }

  random1 = () => {
    timer1 = setTimeout(() => {
      let value1 = Math.floor(Math.random() * 3)
      let player1 = initState.case[value1]
      client.publish('rpsgame',`random1:${value1}:${player1}`)
    }, 3000);
  }

  // clickStart2 = () => {
    // client.publish('rpsgame', 'start', () => {
      // this.chooseStart2()
    // })
  // }

  chooseStart2 = () => {
    client.publish('rpsgame', 'start2')
    // this.setState({
    //   start2: 1
    // }, () => {
    //   timer2 = setTimeout(() => {
    //     let value2 = Math.floor(Math.random() * 3)
    //     let player2 = initState.case[value2]
    //     this.setState({
    //       value2: value2,
    //       player2: player2
    //     }, () => this.printScore())
    //   }, 3000);
    // })
  }

  random2 = () => {
    timer2 = setTimeout(() => {
      let value2 = Math.floor(Math.random() * 3)
      let player2 = initState.case[value2]
      client.publish('rpsgame',`random2:${value2}:${player2}`)
    }, 3000);
  }

  chooseRock1 = () => {
    
    client.publish('rpsgame', `${this.state.currentPlayer}:rock`)
    // console.log("masuk rock1")
    // clearTimeout(timer1)
    // this.setState({
    //   player1: initState.case[0],
    //   value1: 0
    // }, () => {
    //   this.printScore()
    // })
  }

  choosePaper1 = () => {
    client.publish('rpsgame', `${this.state.currentPlayer}:paper`)
    // clearTimeout(timer1)
    // this.setState({
    //   player1: initState.case[1],
    //   value1: 1
    // }, () => {
    //   this.printScore()
    // })
  }

  chooseScissor1 = () => {
    client.publish('rpsgame', `${this.state.currentPlayer}:scissor`)
    // clearTimeout(timer1)
    // this.setState({
    //   player1: initState.case[2],
    //   value1: 2
    // }, () => {
    //   this.printScore()
    // })
  }

  chooseRock2 = () => {
    client.publish('rpsgame', `${this.state.currentPlayer}:rock`)
    // clearTimeout(timer2)
    // this.setState({
    //   player2: initState.case[0],
    //   value2: 0
    // }, () => {
    //   this.printScore()
    // })
  }

  choosePaper2 = () => {
    client.publish('rpsgame', `${this.state.currentPlayer}:paper`)
    // clearTimeout(timer2)
    // this.setState({
    //   player2: initState.case[1],
    //   value2: 1
    // }, () => {
    //   this.printScore()
    // })
  }

  chooseScissor2 = () => {
    client.publish('rpsgame', `${this.state.currentPlayer}:scissor`)
    // clearTimeout(timer2)
    // this.setState({
    //   player2: initState.case[2],
    //   value2: 2
    // }, () => {
    //   this.printScore()
    // })
  }

  printScore() {
    // client.publish('rpsgame','print')
    const player1 = this.state.player1
    const player2 = this.state.player2
    const value1 = this.state.value1
    const value2 = this.state.value2
    let score1 = this.state.score1
    let score2 = this.state.score2
    let round1 = this.state.round1
    let round2 = this.state.round2

    console.log("score1 awal: ", score1, "score2 awal: ", score2)
    if(player1 !== "" && player2 !== "" && round1 === round2){
      
      if((value1+1) % 3 === value2){
        score2 += 1
        this.setState({
          score2: score2
        })
      }
      else if(value1 === value2){
        console.log("DRAW")
      }
      else{
        score1 += 1
        this.setState({
          score1: score1
        })
      }

      console.log("score1: ", score1, "score2: ", score2)
    }

    if(score1 + score2 >= 5){
      if(score1 > score2){
        console.log("player 1 WIN")
        this.setState({
          result: "PLAYER 1 WIN"
        })
      }
      if(score2 > score1){
        console.log("player 2 WIN")
        this.setState({
          result: "PLAYER 2 WIN"
        })
      }
    }
  }

  chooseNext1 = () =>{
    let round1 = this.state.round1
    let round2 = this.state.round2
    if(round1 === round2){
      round1 += 1
    }
    client.publish('rpsgame',`next1:${round1}`)
    this.setState({
      player1:"",
      value1:-1
    }, () => this.chooseStart1())
  }

  chooseNext2 = () =>{
    let round1 = this.state.round1
    let round2 = this.state.round2
    if(round1 === round2){
      round2 += 1
    }
    client.publish('rpsgame',`next1:${round2}`)
    this.setState({
      player2:"",
      value2:-1
    }, () => this.chooseStart2())
  }

  renderStart1(){
    if(this.state.currentPlayer === "1" && this.state.start1 === 0){
      return <button onClick={this.chooseStart1}>Start</button>
    }
  }

  renderStart2(){
    if(this.state.currentPlayer === "2" && this.state.start2 === 0){
      return <button onClick={this.chooseStart2}>Start</button>
    }
  }

  renderButton1(){
    if(this.state.currentPlayer === "1" && this.state.start1 === 1 && this.state.player1 === ""){
    // if(this.state.currentPlayer === "1"){  
    return(
        <div>
          <button onClick={this.chooseRock1}>Rock</button>
          <button onClick={this.choosePaper1}>Paper</button>
          <button onClick={this.chooseScissor1}>Scissor</button>
        </div>
      )
    }
  }

  renderButton2(){
    if(this.state.currentPlayer === "2" && this.state.start2 === 1 && this.state.player2 === ""){
    // if(this.state.currentPlayer === "2"){  
    return(
        <div>
          <button onClick={this.chooseRock2}>Rock</button>
          <button onClick={this.choosePaper2}>Paper</button>
          <button onClick={this.chooseScissor2}>Scissor</button>
        </div>
      )
    }
  }

  render(){
    return (
      <div className="main">

        <div className="container">
          <div className="containerPlayer1">
            <h2>Player 1</h2>
            <span className="pict">
              <h1>{this.state.player1}</h1>
            </span>
            
            {this.renderStart1()}
            {this.renderButton1()}
            {(this.state.player1 !== "" && this.state.currentPlayer === "1") ? <button onClick={this.chooseNext1}>Next</button> : ""}
            
          </div>
          <div className="containerVs">
            <h1>VS</h1>
            <span></span>
          </div>
          <div className="containerPlayer2">
            <h2>Player 2</h2>
            <span className="pict">
              <h1>{this.state.player2}</h1>
            </span>
            {this.renderStart2()}
            {this.renderButton2()}
            
            {(this.state.player2 !== "" && this.state.currentPlayer === "2") ? <button onClick={this.chooseNext2}>Next</button> : ""}
            
              
            
          
          </div>
          <div className="containerScore1">
            <div className="scorePlayer1">
              <span>{this.state.score1}</span>
            </div>
          </div>
          <div className="containerScore">
            <h1>Score</h1>
          </div>
          <div className="containerScore2">
            <div className="scorePlayer2">
            <span>{this.state.score2}</span>
            </div>
          </div>
        </div>

        {this.state.result !== "" ? <div className="containerResult">
          <h1>{this.state.result}</h1>
        </div> : ""}
        

      </div>
    );
  }
}

export default App;
