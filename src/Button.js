import React from "react";

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <button onClick={this.props.onClick} disabled={this.props.disabled}>
                {this.props.caption} {this.props.counter !== undefined && `(${this.props.counter})`}
            </button>
        );
    }
}

export default Button;