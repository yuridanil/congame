import React from "react";
import './Card.css';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleClick() {
        this.props.onClick(this.props.id);
    }

    render() {
        const myStyle = {
            backgroundImage: `url('${this.props.src}')`,
            backgroundSize: this.props.flipped ? "contain" : "0px 0px"
        };

        return (
            <div className="col-auto">
                <div className="Card" id={this.props.id} style={myStyle} onClick={this.handleClick.bind(this)}>
                </div>
            </div>
        );
    }
}

export default Card;