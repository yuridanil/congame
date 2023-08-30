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
            opacity: this.props.flipped ? 1 : 0
        };

        return (
            <div className="Card" id={this.props.id} onClick={this.handleClick.bind(this)}>
                <img alt="" src={this.props.src} style={myStyle}/>
            </div>
        );
    }
}

export default Card;