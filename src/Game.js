import React from "react";
import Board from "./Board";
// import Button from "./Button";
import Timer from "./Timer";

import { Button, Row, Col, FormControl, Form, InputGroup } from 'react-bootstrap';

// TODO: add comments
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
            colsCount: "4",
            rowsCount: "3",
            searchKeyword: "monkeys",
            cards: [],
        };
    }

    loadImages(keyword, count) {
        let flickrSearchURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&sort=interestingness-desc&page=1&extras=url_q";
        let FLICKR_API_KEY = "c82dd287a39769d612a519299ad58bd0";
        let searchUrl = `${flickrSearchURL}&api_key=${FLICKR_API_KEY}&text=${keyword}&per_page=${count}`;
        console.log(searchUrl);
        let options = { mode: "cors" };
        searchUrl = '/test.json';
        fetch(searchUrl, options)
            .then(response => response.json())
            .then(json => {
                if (json.stat === "ok" && json.photos.photo.length >= count) {
                    this.setState((prevState) => ({
                        mode: 2, cards: json.photos.photo
                            .slice(0, count) // cut if result contains more elements
                            .flatMap(e => [{ id: `1${e.id}`, src: e.url_q, flipped: 0 }, { id: `2${e.id}`, src: e.url_q, flipped: 0 }]) // map to cards
                            .sort(() => .5 - Math.random())
                    }));
                } else {
                    this.setState({ mode: 0 });
                    alert(`Error loading images: result:${json.stat} count:${json.photos.photo.length}`); // TODO: change to toast
                }
            });
    }

    handlePlayClick() {
        let cardsCount = this.state.colsCount * this.state.rowsCount;
        if (cardsCount % 2 > 0 || cardsCount < 4 || cardsCount > 64) {
            alert("The number of cards must be even and between 4 and 64. Change the number of columns or rows");
        }
        else {
            this.setState({ mode: 1, hintCount: 3, successFlips: 0, failureFlips: 0, hintOn: null, flipped1: null, flipped2: null });
            //this.loadImages(this.state.searchKeyword, this.state.colsCount * this.state.rowsCount / 2);
            setTimeout(() => this.loadImages(this.state.searchKeyword, this.state.colsCount * this.state.rowsCount / 2), 1300);
        }
    }

    handleStopClick() {
        this.setState({ mode: 0 });
        //        console.log(this.state);
    }

    handleHintClick() {
        if (this.state.hintCount > 0) {
            let hintTimeout = setTimeout(() => {
                this.setState({
                    hintOn: null
                });
            }, 1000);
            this.setState((prevState) => ({
                hintCount: prevState.hintCount - 1,
                hintOn: hintTimeout
            }));
        }
    }

    handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    setFlipped(id, flipped) {
        let cards = this.state.cards;
        let i = cards.findIndex(e => e.id === id);
        this.setState(({ cards }) => ({
            cards: [
                ...cards.slice(0, i),
                {
                    ...cards[i],
                    flipped: flipped,
                },
                ...cards.slice(i + 1)
            ]
        }));
    }

    handleCardClick(id) {
        let cards = this.state.cards;
        let card = cards.find(e => e.id === id);
        if (!card.flipped && this.state.flipped2 === null && this.state.hintOn === null) {
            this.setFlipped(id, true);
            if (this.state.flipped1 === null) {
                this.setState({ flipped1: id });
            } else {
                if (this.state.flipped1.slice(1) === id.slice(1)) {
                    this.setState((prevState) => ({ flipped1: null, flipped2: null, successFlips: prevState.successFlips + 1 }));
                    alert('');
                } else {
                    this.setState((prevState) => ({ flipped2: id, failureFlips: prevState.failureFlips + 1 }));
                    let flipTimeout = setTimeout(() => {
                        this.setFlipped(this.state.flipped1, false);
                        this.setFlipped(this.state.flipped2, false);
                        this.setState({ flipped1: null, flipped2: null });
                    }, 1000);
                }
            }
        }
    }

    render() {
        const mode = this.state.mode;
        return (
            <Form>
                <Row className="m-2 justify-content-center"><b>Concentration Game</b></Row>
                <Row className="m-2 justify-content-center">Find two cards that match to win the cards</Row>
                {(mode === 0 || mode === 3 || mode === 1) &&
                    <Row className="m-2 align-items-center justify-content-center">
                        <Col xs="auto">
                            <InputGroup>
                                <InputGroup.Text>Board size:</InputGroup.Text>
                                <FormControl name="colsCount" xs="auto" placeholder="Columns" defaultValue={this.state.colsCount} onChange={this.handleInputChange.bind(this)} />
                                <InputGroup.Text>&#215;</InputGroup.Text>
                                <FormControl name="rowsCount" xs="auto" placeholder="Rows" defaultValue={this.state.rowsCount} onChange={this.handleInputChange.bind(this)} />
                                <InputGroup.Text>Keyword:</InputGroup.Text>
                                <FormControl name="searchKeyword" xs="auto" placeholder="Search keyword" defaultValue={this.state.searchKeyword} onChange={this.handleInputChange.bind(this)} />
                            </InputGroup>
                        </Col>
                        <Col xs="auto">
                            <Button onClick={this.handlePlayClick.bind(this)} >Play</Button>
                        </Col>
                    </Row>
                }
                {mode === 2 &&
                    <Row className="m-2 align-items-center justify-content-center">
                        <Col xs="auto">
                            <Button onClick={this.handleStopClick.bind(this)}>Stop</Button>
                        </Col>
                        <Col xs="auto">
                            <Button onClick={this.handleHintClick.bind(this)} disabled={this.state.hintCount === 0 || this.state.hintOn !== null}>Hint ({this.state.hintCount})</Button>
                        </Col>
                    </Row>
                }

                <Row className="m-2 align-items-center justify-content-center">
                    {mode === 1 && `Loading images...`}
                    {mode === 2 && <Timer />}
                    {mode === 3 && `Congrats, you won! Stats: 123`}
                </Row>

                {(mode === 2 || mode === 3) &&
                    <Board cards={this.state.cards} cols={this.state.colsCount} rows={this.state.rowsCount} hintOn={this.state.hintOn} onClick={this.handleCardClick.bind(this)} />
                }

            </Form>
        );
    }
}

export default Game;