import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class MyModal extends Component {
    state = {
        isOpen: false
    };

    onYes() {
        this.props.onYes(this.props.id);
    };

    onNo() {
        this.props.onNo(this.props.id);
    };

    onCustom1() {
        this.props.onCustom1(this.props.id);
    };

    render() {
        return (
            <Modal show={this.props.show} onHide={this.onNo.bind(this)} centered size="lg" className="d-inline-flex">
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.body}</Modal.Body>
                <Modal.Footer className="flex-nowrap justify-content-center">
                    {this.props.custom1 &&
                        <Button className="text-nowrap" variant="primary" onClick={this.onCustom1.bind(this)}>
                            {this.props.custom1}
                        </Button>
                    }
                    {this.props.yes &&
                        <Button className="text-nowrap" variant="primary" onClick={this.onYes.bind(this)}>
                            {this.props.yes}
                        </Button>
                    }
                    <Button className="text-nowrap" variant="secondary" onClick={this.onNo.bind(this)}>
                        {this.props.no}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default MyModal;