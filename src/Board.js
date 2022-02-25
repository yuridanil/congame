import React from "react";
import Card from "./Card";

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
        return (
            <div className="container">
                {
                    cards.map((e1, i1) => { // group to rows
                        return i1 % cols === 0 ? cards.slice(i1, i1 + cols) : null;
                    }).filter(e2 => { return e2; })
                        .map((e, i) => // map to cards in rows
                            <div key={i} className="row justify-content-center">
                                {e.map(c => <Card key={c.id} id={c.id} src={c.src} flipped={c.flipped || this.props.hintOn !== null} onClick={this.handleClick.bind(this)} />)}
                            </div>
                        )
                }
            </div>

        );
    }
}

export default Board;