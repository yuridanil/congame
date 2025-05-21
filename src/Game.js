import React from "react";
import { Button, Row, Col, FormControl, Form, InputGroup, Table } from 'react-bootstrap';
import Board from "./Board";
import Timer from "./Timer";
import MyModal from "./MyModal";
import {
    BOARD, IMAGE_TYPES, ANIMALS, BASE_COLORS, DISTINCT16_COLORS,
    ENGLISH_LETTERS, RUSSIAN_LETTERS, NUMBERS, SYMBOLS, EMOJIS, FLAGS,
    TOP_WORDS, GOOD_WORDS, WIN_WORDS,
    SMILES, SHAPES
} from './Constants';
import { cartesian, genSvg } from "./Utils";
import Svgtext from "./Svgtext";
import version from './version.json';
import { Lang } from './Lang';
import './Game.css';

class Game extends React.Component {
    successFlips = 0;
    failureFlips = 0;
    oldScore = 0;
    newScore = 0;
    bMap = new Map(BOARD);

    constructor(props) {
        super(props);
        this.state = {
            lang: Lang,
            mode: 0,
            aspect: window.innerWidth / window.innerHeight,
            level: localStorage.getItem("level") || "1",
            searchKeyword: ANIMALS[Math.floor(Math.random() * ANIMALS.length)],
            imageType: localStorage.getItem("imageType") || "6",
            cards: [],
            winModal: false,
            showModal: false,
            errorMessage: null,
            scores: JSON.parse(localStorage.getItem("scores") || '{}'),
            showImage: false,
            imageSrc: null
        };
        this.Timer1 = React.createRef();
        window.onresize = () => {
            this.setState({ aspect: window.innerWidth / window.innerHeight });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // save select state to local storage
        for (let s in prevState) {
            if (prevState[s] !== this.state[s] && ['level', 'imageType'].includes(s)) {
                localStorage.setItem(s, this.state[s])
            }
        }
    }

    componentDidMount() {
        document.title = this.state.lang.title;
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
            case '#8': chars = SMILES; colors = ['']; break;
            case '#9': chars = SHAPES; colors = BASE_COLORS; break;
            default: break;
        }
        switch (keyword) {
            case '#1':
                symbols = Array.from({ length: count }).map(e => new XMLSerializer().serializeToString(genSvg(512, 512, 0, 3, DISTINCT16_COLORS)))
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
            case '#8':
            case '#9':
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

    newGame() {
        this.successFlips = 0;
        this.failureFlips = 0;
        this.setState({ mode: 1, hintCount: 3, failureFlips: 0, hintOn: null, flipped1: null, flipped2: null, errorMessage: null, winModal: false });
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
            case '8':
            case '9':
                keyword = `#${this.state.imageType}`
                break;
            default:
                keyword = 'galaxy'
        }
        let board = this.bMap.get(parseInt(this.state.level));
        this.loadImages(keyword, board[0] * board[1] / 2);
    }

    handlePlayClick() {
        this.newGame();
    }

    handleNextLevel() {
        this.setState((prevState) => ({ level: parseInt(prevState.level) + 1 }), () =>
            this.handlePlayClick()
        );
    }

    handleScoresClick(newmode) {
        this.setState({ mode: newmode });
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

    handleNewGameClick() {
        this.setState({
            showModal: true,
            modalTitle: `${this.state.lang.warning}!`,
            modalBody: `${this.state.lang.startnew}?`,
            onModalYes: () => {
                this.setState({ showModal: false });
                this.Timer1.current.restart();
                this.newGame();
            },
            onModalNo: () => {
                this.setState({ showModal: false });
            }
        });

    }

    handleClearClick() {
        this.setState({
            showModal: true,
            modalTitle: `${this.state.lang.warning}!`,
            modalBody: `${this.state.lang.cleanup}!`,
            onModalYes: () => {
                localStorage.removeItem("scores");
                this.oldScore = 0;
                this.newScore = 0;
                this.setState({ showModal: false, scores: {} });
            },
            onModalNo: () => {
                this.setState({ showModal: false });
            }
        });

    }

    handleStopClick() {
        this.setState({
            showModal: true,
            modalTitle: `${this.state.lang.warning}!`,
            modalBody: `${this.state.lang.progresslost}?`,
            onModalYes: () => {
                this.state.cards.forEach(e => this.setFlipped(e.id, true));
                this.setState({ showModal: false, mode: 3 });
            },
            onModalNo: () => {
                this.setState({ showModal: false });
            }
        });
    }

    handleCloseModal() {
        this.setState({ mode: 3, winModal: false });
    }

    handleCardClick(id) {
        let cards = this.state.cards;
        let card = cards.find(e => e.id === id);
        if (this.state.mode === 3) {
            this.setState({ showImage: true, imageSrc: card.src });
        };
        if (!card.flipped && this.state.flipped2 === null && this.state.hintOn === null) { // card not flipped and only one flipped yet in pair
            this.setFlipped(id, true);
            if (this.state.flipped1 === null) { // this is 1st card
                this.setState({ flipped1: id });
            } else { // this is 2nd card
                if (this.state.flipped1.slice(1) === id.slice(1)) { // matching cards
                    this.setState((prevState) => ({ flipped1: null, flipped2: null }));
                    this.successFlips++;
                    if (this.successFlips === cards.length / 2) { // game over
                        let timeSpent = this.Timer1.current.getSeconds();
                        let cardCount = this.bMap.get(parseInt(this.state.level)).reduce((a, b) => a * b, 1);
                        let flipscore = Math.round(100 / Math.max(1, (this.failureFlips * 2 + 1) / cardCount));
                        let timescore = Math.round(100 * Math.min(1, cardCount * 2 / timeSpent));
                        let score = (flipscore - 1) * 100 + timescore;
                        this.oldScore = this.state.scores[this.state.imageType + ";" + this.state.level] || 0;
                        this.newScore = score;
                        this.setState({ mode: 3, timerValue: timeSpent, winModal: true });
                        if (this.newScore > this.oldScore) {
                            let newScores = { [this.state.imageType + ";" + this.state.level]: score };
                            this.setState(
                                (prevState) => ({
                                    scores: { ...prevState.scores, ...newScores }
                                }),
                                () => { localStorage.setItem('scores', JSON.stringify(this.state.scores)); }
                            );
                        }
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

    handleImageClick() {
        this.setState({ showImage: false });
    }
    render() {
        const mode = this.state.mode;
        return (
            <>
                <Form className="cgform">
                    {(mode === 0 || mode === 3 || mode === 4) && <Row className="m-1 pt-3 justify-content-center"><h3>{this.state.lang.title}</h3></Row>}
                    {(mode === 0 || mode === 3) &&
                        <>
                            <Row className="m-1 justify-content-center">{this.state.lang.desc}</Row>
                            <Row className="m-1 align-items-center justify-content-center">
                                <Col xs="auto">
                                    <InputGroup className="flex-nowrap">
                                        <InputGroup.Text>{this.state.lang.type}:</InputGroup.Text>
                                        <Form.Select aria-label="Source" name="imageType" xs="auto" value={this.state.imageType} onChange={this.handleInputChange.bind(this)}>
                                            {/* {IMAGE_TYPES.map((e, i) => <option key={"imagetype" + i} value={i}>{e}</option>)} */
                                                IMAGE_TYPES.map((e, i) => <option key={"imagetype" + i} value={i}>{this.state.lang.imagetypes[i] + ": " + e}</option>)
                                            }
                                        </Form.Select>
                                        {this.state.imageType === '0' &&
                                            <FormControl name="searchKeyword" xs="auto" placeholder="Search keyword" defaultValue={this.state.searchKeyword} onChange={this.handleInputChange.bind(this)} />
                                        }
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="m-1 align-items-center justify-content-center">
                                <Col xs="auto">
                                    <InputGroup className="flex-nowrap">
                                        <InputGroup.Text>{this.state.lang.level}:</InputGroup.Text>
                                        <Form.Select className="w-50" aria-label="Cards" name="level" xs="auto" placeholder="Cards" value={this.state.level} onChange={this.handleInputChange.bind(this)}>
                                            {[...BOARD].map((e) =>
                                                <option key={e[0]} value={e[0]}>
                                                    {`${e[0]}${this.state.scores[this.state.imageType + ';' + e[0]] === 10000 ? " 🏆" :
                                                        this.state.scores[this.state.imageType + ';' + e[0]] < 10000 ? " 🏅" : ""
                                                        }`}
                                                </option>
                                            )
                                            }
                                        </Form.Select>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="m-1 align-items-center justify-content-center g-1 flex-nowrap">
                                <Col xs="auto">
                                    <Button onClick={this.handlePlayClick.bind(this)}>{this.state.lang.play}</Button>
                                </Col>
                                <Col xs="auto">
                                    <Button variant="secondary" onClick={this.handleScoresClick.bind(this, 4)}>{this.state.lang.scores}</Button>
                                </Col>
                            </Row>
                            {(mode === 0) &&
                                <Row className="m-1 align-items-center justify-content-center g-1">
                                    <Col xs="auto">
                                        {this.state.lang.version}{` ${version.buildMajor}.${version.buildMinor}.${version.buildRevision}`}
                                    </Col>
                                </Row>
                            }
                        </>
                    }
                    { // Game
                        (mode === 2) && <>
                            <Row className="mx-auto my-1 align-items-center justify-git add content-center g-1 flex-nowrap">
                                <Col xs="auto">
                                    <Button className="" onClick={this.handleStopClick.bind(this)}>{this.state.lang.stop}</Button>
                                </Col>
                                <Col xs="auto">
                                    <Button variant="danger" onClick={this.handleNewGameClick.bind(this)}>{this.state.lang.new}</Button>
                                </Col>
                                <Col xs="auto">
                                    <Button variant="secondary" onClick={this.handleHintClick.bind(this, 1000)} disabled={this.state.hintCount === 0 || this.state.hintOn !== null}>{this.state.lang.hint} ({this.state.hintCount})</Button>
                                </Col>
                            </Row>
                            {/* <Row className="mx-auto my-1 align-items-center justify-git add content-center g-1 flex-nowrap">
                                <Col xs="auto">
                                    <Button variant="secondary" onClick={this.handleShuffleClick.bind(this)}>{this.state.lang.shuffle}</Button>
                                </Col>
                            </Row> */}
                            <Row className="mx-auto my-1 align-items-center justify-git add content-center g-1 flex-nowrap">
                                <Col xs="auto">
                                    <Timer ref={this.Timer1} />
                                </Col>
                            </Row>
                        </>
                    }
                    { // Status text
                        (mode === 0 || mode === 1 || mode === 3) &&
                        <Row className="m-1 align-items-center justify-content-center">
                            {mode === 0 && this.state.errorMessage && <p className="text-danger">{this.state.errorMessage}</p>}
                            {mode === 1 && `${this.state.lang.loadingmsg}`}
                        </Row>
                    }
                </Form >
                { // Board
                    (mode === 2 || mode === 3) &&
                    <Board cards={this.state.cards}
                        cols={this.state.aspect > 1 ? this.bMap.get(parseInt(this.state.level))[1] : this.bMap.get(parseInt(this.state.level))[0]}
                        rows={this.state.aspect > 1 ? this.bMap.get(parseInt(this.state.level))[0] : this.bMap.get(parseInt(this.state.level))[1]}
                        hintOn={this.state.hintOn}
                        onClick={this.handleCardClick.bind(this)}
                    />
                }
                { // Score table
                    mode === 4 &&
                    <>
                        <Row className="m-1 justify-content-center">{this.state.lang.scoretable}: {IMAGE_TYPES[this.state.imageType]}</Row>
                        <Row className="m-1 justify-content-center"></Row>
                        <Row className="m-1 align-items-center justify-content-center g-1">
                            <Col xs="auto">
                                <Table size="sm table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>{this.state.lang.level}</th>
                                            <th>{this.state.lang.score}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(this.state.scores)
                                            .filter(e => parseInt(e.split(';')[0]) === parseInt(this.state.imageType))
                                            .sort((a, b) => parseInt(a.split(';')[1]) - parseInt(b.split(';')[1]))
                                            .map(e =>
                                                <tr key={e}>
                                                    <td>{e.split(";")[1]}</td>
                                                    <td>{(this.state.scores[e] === 10000 && "🏆") || this.state.scores[e]}</td>
                                                </tr>
                                            )}

                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="m-2 align-items-center justify-content-center g-1">
                            <Col xs="auto">
                                <Button variant="danger" onClick={this.handleClearClick.bind(this)}>{this.state.lang.clear}</Button>
                            </Col>
                            <Col xs="auto">
                                <Button variant="secondary" onClick={this.handleScoresClick.bind(this, 0)}>{this.state.lang.close}</Button>
                            </Col>
                        </Row>
                    </>
                }
                <MyModal show={this.state.winModal} yes={this.state.lang.nextlevel} no={this.state.lang.close} custom1={this.state.lang.replay}
                    title={`${this.state.lang.level}  ${this.state.level} - ${this.state.lang.win}!`}
                    onNo={this.handleCloseModal.bind(this)}
                    onYes={this.handleNextLevel.bind(this)}
                    onCustom1={this.handlePlayClick.bind(this)}
                    body={<>
                        <Row className="align-items-center justify-content-center">
                            <Col xs="5 g-1">
                                {this.newScore === 10000 ? <Svgtext text="🏆" /> : this.newScore > this.oldScore && <Svgtext text="🏅" />}
                            </Col>
                        </Row>
                        <Row className="align-items-center justify-content-center">
                            <Col xs="auto">
                                <Table size="sm" borderless>
                                    <tbody>
                                        <tr>
                                            <td>{this.newScore > this.oldScore ? this.state.lang.newhigh : this.state.lang.score}:</td>
                                            <td>{this.newScore}</td>
                                        </tr>
                                        <tr>
                                            <td>{this.state.lang.oldscore}:</td>
                                            <td>{this.oldScore}</td>
                                        </tr>
                                        <tr>
                                            <td>{this.state.lang.numflips}:</td><td>{this.successFlips + this.failureFlips}</td>
                                        </tr>
                                        <tr className="align-items-center justify-content-center">
                                            <td>{this.state.lang.successful}:</td><td>{this.successFlips}</td>
                                        </tr>
                                        <tr className="align-items-center justify-content-center">
                                            <td>{this.state.lang.failure}:</td><td>{this.failureFlips}</td>
                                        </tr>
                                        <tr className="align-items-center justify-content-center">
                                            <td>{this.state.lang.timespent}:</td><td>{this.state.timerValue}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </>}
                />
                <MyModal show={this.state.showModal} yes={this.state.lang.yes} no={this.state.lang.no} title={this.state.modalTitle} body={this.state.modalBody} onYes={this.state.onModalYes} onNo={this.state.onModalNo} />
                {this.state.showImage && <div className="d-flex w-100 h-100 z-1000 position-absolute bg-white bg-opacity-75" onClick={this.handleImageClick.bind(this)}>
                    <img id="fsImage" className="fsImage w-100 h-100" src={this.state.imageSrc}/>
                </div>}
            </>
        );
    }
}

export default Game;