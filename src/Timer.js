import React from "react";

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: new Date(),
            timer: "00:00",
            value: 0
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        let now = new Date();
        let minutes = Math.floor((now - (this.state.start)) / 1000 / 60);
        let seconds = Math.floor((now - (this.state.start)) / 1000 % 60);
        this.setState({
            timer: `${minutes.toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`,
            value: this.state.value + 1
        });
    }

    render() {
        return (
            <div className="Timer">
                {this.state.timer}
            </div>
        );
    }
}

export default Timer;