import React from "react";
import { Button, Row, Col, FormControl, Form, InputGroup } from 'react-bootstrap';
import Board from "./Board";
import Timer from "./Timer";
import MyModal from "./MyModal";
import { IMAGE_TYPES, SIZES, ANIMALS, BASE_COLORS, DISTINCT16_COLORS, ENGLISH_LETTERS, RUSSIAN_LETTERS, NUMBERS, SYMBOLS, EMOJIS, FLAGS } from './Constants';
import { cartesian, genSvg } from "./Utils";

class Game extends React.Component {
    successFlips = 0;
    failureFlips = 0;

    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
            colsCount: "4",
            rowsCount: "4",
            searchKeyword: ANIMALS[Math.floor(Math.random() * ANIMALS.length)],
            imageType: '6',
            cards: [],
            winModal: false,
            stopModal: false,
            errorMessage: null
        };
    }

    loadImages(keyword, count) {
        let symbols, chars, colors;
        switch (keyword) {
            case '#2': chars = ENGLISH_LETTERS; colors = BASE_COLORS; break;
            case '#3': chars = RUSSIAN_LETTERS; colors = BASE_COLORS; break;
            case '#4': chars = NUMBERS; colors = BASE_COLORS; break;
            case '#5': chars = SYMBOLS; colors = BASE_COLORS; break;
            case '#6': chars = EMOJIS; colors = ['']; break;
            case '#7': chars = FLAGS; colors = ['']; break;
            default: break;
        }
        switch (keyword) {
            case '#1':
                symbols = Array.from({ length: count }).map(e => new XMLSerializer().serializeToString(genSvg(512, 512, 0, 5, DISTINCT16_COLORS)))
                    .flatMap((e, i) => [{
                        id: `1ltr${i}`,
                        flipped: 0,
                        src: `data:image/svg+xml;utf8,` + e
                    }, {
                        id: `2ltr${i}`,
                        flipped: 0,
                        src: `data:image/svg+xml;utf8,` + e
                    }])
                    .sort(() => .5 - Math.random()) // shuffle;
                this.setState((prevState) => ({
                    mode: 2, cards: symbols
                }));
                break;
            case '#2':
            case '#3':
            case '#4':
            case '#5':
            case '#6':
            case '#7':
                symbols = cartesian(chars, colors)
                    .sort(() => .5 - Math.random()) // choose random color letters
                    .slice(0, count) // cut if result contains more elements
                    .flatMap((e, i) => [{
                        id: `1ltr${i}`,
                        flipped: 0,
                        src: `data:image/svg+xml;utf8,<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="font: bold 8.8px sans-serif; fill: ${e[1]};">${e[0]}</text></svg>`
                    }, {
                        id: `2ltr${i}`,
                        flipped: 0,
                        src: `data:image/svg+xml;utf8,<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="font: bold 8.8px sans-serif; fill: ${e[1]};">${e[0]}</text></svg>`
                    }])
                    .sort(() => .5 - Math.random()) // shuffle
                    ;
                this.setState((prevState) => ({
                    mode: 2, cards: symbols
                }));
                break;
            default:
                let flickrSearchURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&sort=interestingness-desc&page=1&content_types=0&media=photos&extras=url_w";
                let FLICKR_API_KEY = "c82dd287a39769d612a519299ad58bd0";
                let searchUrl = `${flickrSearchURL}&api_key=${FLICKR_API_KEY}&text=${keyword}&per_page=${count}`;
                let options = { mode: "cors" };
                fetch(searchUrl, options)
                    .then(response => response.json())
                    .then(json => {
                        if (json.stat === "ok" && json.photos.photo.length >= count) {
                            this.setState((prevState) => ({
                                mode: 2, cards: json.photos.photo
                                    .slice(0, count) // cut if result contains more elements
                                    .flatMap(e => [{ id: `1${e.id}`, src: e.url_w, flipped: 0 }, { id: `2${e.id}`, src: e.url_w, flipped: 0 }]) // map to cards
                                    .sort(() => .5 - Math.random()) // shuffle
                            }));
                        } else {
                            this.setState({ mode: 0 });
                            this.setState({ errorMessage: `Error loading images. Result: ${json.stat}, count: ${json.photos.photo.length}` });
                        }
                    });
        }
    }

    handlePlayClick() {
        this.successFlips = 0;
        this.failureFlips = 0;
        let cols = this.state.colsCount;
        let rows = this.state.rowsCount;
        if (cols * rows % 2 > 0 || cols < 2 || rows < 2 || cols > 16 || rows > 16) { // check input
            this.setState({ errorMessage: "The number of cards must be even" });
        }
        else {
            this.setState({ mode: 1, hintCount: 3, failureFlips: 0, hintOn: null, flipped1: null, flipped2: null, errorMessage: null });
            let keyword;
            switch (this.state.imageType) {
                case '0':
                    keyword = this.state.searchKeyword;
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    keyword = `#${this.state.imageType}`
                    break;
                default:
                    keyword = 'galaxy'
            }
            this.loadImages(keyword, this.state.colsCount * this.state.rowsCount / 2);
            //setTimeout(() => this.loadImages(this.state.searchKeyword, cols * rows / 2), 300); //test
        }
    }

    handleStopClick() {
        this.setState({ stopModal: true });
    }

    handleHintClick(duration) {
        if (this.state.hintCount > 0) {
            let hintTimeout = setTimeout(() => {
                this.setState({ // flip cards back
                    hintOn: null
                });
            }, duration);
            this.setState((prevState) => ({ // flip cards
                hintCount: prevState.hintCount - 1,
                hintOn: hintTimeout
            }));
        }
    }

    handleShuffleClick() {
        this.setState((prevState) => ({ cards: prevState.cards.sort(() => .5 - Math.random()) }));
    }

    handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value, cards: [] });
    }

    setFlipped(id, flipped) {
        let cards = this.state.cards;
        let i = cards.findIndex(e => e.id === id);
        this.setState(({ cards }) => ({ // set specified card flipped
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
        if (!card.flipped && this.state.flipped2 === null && this.state.hintOn === null) { // card not flipped and only one flipped yet in pair
            this.setFlipped(id, true);
            if (this.state.flipped1 === null) { // this is 1st card
                this.setState({ flipped1: id });
            } else { // this is 2nd card
                if (this.state.flipped1.slice(1) === id.slice(1)) { // matching cards
                    this.setState((prevState) => ({ flipped1: null, flipped2: null }));
                    this.successFlips++;
                    if (this.successFlips === cards.length / 2) { // game over
                        this.setState({ mode: 3, winModal: true });
                    }
                } else { // not matching cards
                    this.failureFlips++;
                    this.setState((prevState) => ({ flipped2: id }));
                    let flipTimeout = setTimeout(() => { // flip not matching cards after 1 sec
                        this.setFlipped(this.state.flipped1, false);
                        this.setFlipped(this.state.flipped2, false);
                        this.setState({ flipped1: null, flipped2: null });
                        clearTimeout(flipTimeout);
                    }, 1000);
                }
            }
        }
    }

    handleYes(id) {
        id === 1 && this.setState({ mode: 0, stopModal: false });
    }

    handleNo(id) {
        id === 0 && this.setState({ mode: 3, winModal: false });
        id === 1 && this.setState({ stopModal: false });
    }

    render() {
        const mode = this.state.mode;
        return (
            <>
                <Form className="cgform">
                    {(mode === 0 || mode === 3 || mode === 1) &&
                        <>
                            <Row className="m-1 justify-content-center"><b>Concentration Game</b></Row>
                            <Row className="m-1 justify-content-center">Find two cards that match to win the Game</Row>
                            <Row className="m-1 align-items-center justify-content-center">
                                <Col xs="auto">
                                    <InputGroup>
                                        <InputGroup.Text>Board size:</InputGroup.Text>
                                        <Form.Select aria-label="Columns" name="colsCount" xs="auto" placeholder="Columns" defaultValue={this.state.colsCount} onChange={this.handleInputChange.bind(this)}>
                                            {SIZES.map((e) => <option key={e} value={e}>{e}</option>)}
                                        </Form.Select>
                                        <InputGroup.Text>&#215;</InputGroup.Text>
                                        <Form.Select aria-label="Columns" name="rowsCount" xs="auto" placeholder="Rows" defaultValue={this.state.rowsCount} onChange={this.handleInputChange.bind(this)}>
                                            {SIZES.map((e) => <option key={e} value={e}>{e}</option>)}
                                        </Form.Select>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="m-1 align-items-center justify-content-center">

                                <Col xs="auto">
                                    <InputGroup>
                                        <Form.Select aria-label="Source" name="imageType" xs="auto" value={this.state.imageType} onChange={this.handleInputChange.bind(this)}>
                                            {IMAGE_TYPES.map((e, i) => <option key={"imagetype" + i} value={i}>{e}</option>)}
                                        </Form.Select>
                                        {this.state.imageType === '0' &&
                                            <FormControl name="searchKeyword" xs="auto" placeholder="Search keyword" defaultValue={this.state.searchKeyword} onChange={this.handleInputChange.bind(this)} />
                                        }
                                    </InputGroup>
                                </Col>

                            </Row>
                            <Row className="m-1 align-items-center justify-content-center">
                                <Col xs="auto">
                                    <Button onClick={this.handlePlayClick.bind(this)} >Play</Button>
                                </Col>
                            </Row>
                        </>
                    }
                    {mode === 2 &&
                        <Row className="m-1 align-items-center justify-content-center">
                            <Col xs="auto">
                                <Timer />
                            </Col>
                            <Col xs="auto">
                                <Button onClick={this.handleStopClick.bind(this)}>Stop</Button>
                            </Col>
                            <Col xs="auto">
                                <Button onClick={this.handleHintClick.bind(this, 1000)} disabled={this.state.hintCount === 0 || this.state.hintOn !== null}>Hint ({this.state.hintCount})</Button>
                            </Col>
                            <Col xs="auto">
                                <Button onClick={this.handleShuffleClick.bind(this)}>Shuffle</Button>
                            </Col>
                        </Row>
                    }
                    {(mode === 0 || mode === 1 || mode === 3) &&
                        <Row className="m-1 align-items-center justify-content-center">
                            {mode === 0 && this.state.errorMessage && <p className="text-danger">{this.state.errorMessage}</p>}
                            {mode === 1 && `Loading images...`}
                        </Row>
                    }
                    <MyModal id={0} show={this.state.winModal} no="Close" title="Win!" body={`Number of flips: ${this.successFlips + this.failureFlips} (successful: ${this.successFlips}, failure:${this.failureFlips})`} onNo={this.handleNo.bind(this)} />
                    <MyModal id={1} show={this.state.stopModal} yes="Yes" no="No" title="Warning!" body="The progress will be lost. Are you sure?" onYes={this.handleYes.bind(this)} onNo={this.handleNo.bind(this)} />
                </Form>
                {(mode === 2 || mode === 3) &&
                    <Board cards={this.state.cards} cols={parseInt(this.state.colsCount)} rows={parseInt(this.state.rowsCount)} hintOn={this.state.hintOn} onClick={this.handleCardClick.bind(this)} />
                }
            </>
        );
    }
}

export default Game;