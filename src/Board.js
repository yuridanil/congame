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
        const cols = this.props.cols;
//        console.log(this.props);
        
        let table = cards.map((e1, i1) => {
            return i1 % cols === 0 ? cards.slice(i1, i1 + cols) : null;
        }).filter(e2 => { return e2; });
        
          return (

            <div className="container">

                {/* {cards.map(e =>
                        <Card key={e.id} id={e.id} src={e.src} flipped={e.flipped || this.props.hintOn !== null} onClick={this.handleClick} />
                    )} */



                    table.map((e, i) =>
                        <div key={i} className="row justify-content-center">
                            {e.map(c => <Card key={c.id} id={c.id} src={c.src} flipped={c.flipped || this.props.hintOn !== null} onClick={this.handleClick} />)}
                        </div>
                    )

                }
            </div>

        );
    }
}

export default Board;