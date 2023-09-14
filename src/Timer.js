import React from "react";

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: new Date()
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            100
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.forceUpdate();
    }

    restart() {
        this.setState({
            start: new Date()
        });
    }

    render() {
        let diff = Math.floor(((new Date()) - (this.state.start)) / 1000);
        let minutes = Math.floor(diff / 60);
        let seconds = Math.floor(diff % 60);
        return (
            <div className="Timer">
                {`${minutes.toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`}
            </div>
        );
    }
}

export default Timer;