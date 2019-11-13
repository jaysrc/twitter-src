import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import socketIOClient from "socket.io-client";
import CardComponent from './CardComponent';


//import Moment from 'react-moment';

//import 'bootstrap/dist/css/bootstrap.css';

class TweetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      newListLength:0
    };
  }




  handleChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleResume();
    }
  }

  handleResume = () => {
    let term = this.state.searchTerm;
    fetch("http://localhost:4000/setSearchTerm",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ term })
      })
  }

  handlePause = (e) => {
    fetch("http://localhost:4000/pause",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  componentDidMount = () => {
    const socket = socketIOClient('http://localhost:4000/');

    /*let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }*/

    socket.on('connect', () => {
      console.log("Socket Connected ....");
      socket.on("tweets", data => {
        let newList = [data].concat(this.state.items.slice());
        let count = newList.length;
        let sum = (count - this.state.newListLength);
        let avg = (sum /100) * this.state.newListLength;console.log(avg)
        console.log(count,sum,avg);
        this.setState({newListLength:newList.length, items: newList, datacount: count, tweetavg:Math.round(avg) });
        //this.setState({datacount:count}); console.log(datacount)
      });
    });
    socket.on('disconnect', () => {
      socket.off("tweets")
      socket.removeAllListeners("tweets");
      console.log("Socket Disconnected");
    });
  }


  render() {
    let items = this.state.items;

    let itemsCards = <CSSTransitionGroup
      transitionName="example"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}>
      {items.map((x, i) =>
        <CardComponent key={i} data={x} />
      )}
    </CSSTransitionGroup>;

    let searchControls =
      <div>

        <input id="email" type="text" className="validate" value={this.state.searchTerm} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
        <label htmlFor="email">Search</label>
      </div>

    let filterControls = <div>
      <a className="btn-floating btn-small waves-effect waves-light pink accent-2" style={controlStyle} onClick={this.handleResume}><i className="material-icons">play_arrow</i></a>
      <a className="btn-floating btn-small waves-effect waves-light pink accent-2" onClick={this.handlePause} ><i className="material-icons">pause</i></a>
      <p>
        <input type="checkbox" id="test5" />
        <label htmlFor="test5">Retweets</label>
      </p>
    </div>

    let controls = <div>
      {
        items.length > 0 ? filterControls : null
      }
    </div>


    let loading = <div>
      <p className="flow-text">Listening to Streams</p>
      <div className="progress lime lighten-3">
        <div className="indeterminate pink accent-1"></div>
      </div>
    </div>

    return (
      <div className='container mt-4'>
          <div className="row align-items-center">
        <div className="col-6">
          <div>

          </div>
          <div className="input-field">
            {searchControls}
            {
              items.length > 0 ? controls : null
            }
          </div>
        </div>
        <div className='col-6 text-right d-flex align-items-centet justify-content-end'>
          <div className='card1 p-3 text-center'>
            {/*<p><Moment format='h:mm:ss '></Moment></p>*/}
            <p>{this.state.datacount}</p>
            <p>Number of Tweets</p>
          </div>
          <div className='card1 p-3 text-center'>
            {/*<p><Moment format='h:mm:ss '></Moment></p>*/}
            <p>{this.state.tweetavg}</p>
            <p>Average  of Tweets</p>
          </div>

        </div>
        </div>

        <div className="col-12">
          <div>
            {
              items.length > 0 ? itemsCards : loading
            }

          </div>

        </div>
        <div className="col-12">
        </div>
        </div>

    );
  }
}

const controlStyle = {
  marginRight: "5px"
};

export default TweetList;