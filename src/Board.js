import React from "react";
import Card from "./Card";
import './Board.css';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {

        };
    }

    handleClick(id) {
        this.props.onClick(id);
    }

    render() {
        const cards = this.props.cards;
        return (
            <div className="Board">
                {cards.map(e => <Card key={e.id} id={e.id} src={e.src} flipped={e.flipped || this.props.hintOn !== null} onClick={this.handleClick} />)}
            </div>
        );
    }
}

export default Board;