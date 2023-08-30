import React from "react";
import Card from "./Card";
import './Board.css';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleClick(id) {
        this.props.onClick(id);
    }

    render() {
        const cards = this.props.cards;
        const cols = this.props.cols;
        const rows = this.props.rows;
        return (

            <div className="board" style={{ gridTemplateColumns: "auto ".repeat(cols) }}>
                {
                    cards.map((c, i) => // map to cards in rows
                        <Card key={c.id} id={c.id} src={c.src} flipped={c.flipped || this.props.hintOn !== null} onClick={this.handleClick.bind(this)} />
                    )
                }
            </div>
        );
    }
}

export default Board;