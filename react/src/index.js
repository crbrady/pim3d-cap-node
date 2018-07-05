import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

const socket = io.connect("localhost:2000");
socket.on('message', msg => console.log(msg));
socket.on('heartbeats', msg => console.log('heartbeats ='+msg));


    class Clock extends React.Component {
        constructor(props) {
            super(props);
            this.state = {date: new Date()};
        }

        componentDidMount() {
            this.timerID = setInterval(
                () => this.tick(),
                1000
            );
        }

        tick() {
            this.setState({
                date: new Date()
            });
        }

        componentWillUnmount() {
            clearInterval(this.timerID);
        }

        render() {
            return (
                <div>
                    <h1>Hello, world!</h1>
                    <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
                </div>
            );
        }
    }

    function tick() {
        ReactDOM.render(
            <Clock />,
            document.getElementById('root')
        );
    }

    setInterval(tick, 1000);

