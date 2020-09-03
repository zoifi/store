import React, {Component} from 'react';
import axios from 'axios';
import {Button, Modal} from "react-bootstrap";

class EditPostModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showHide: false,
            editPostId: this.props.id,
            editPostTitle: this.props.editPostTitle,
            editPostDescription: this.props.editPostDescription,
            loading: false,
        }
        this.updatePost = this.updatePost.bind(this);
        this.setData = this.setData.bind(this);
    }

    setData(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value
        })
    }

    showHideModal(post) {
        this.setState({
            showHide: !this.state.showHide,
            loading: true,
        })

        this.setState({
            errorM: '',
            editPostId: this.props.editPostId,
            editPostTitle: this.props.editPostTitle,
            editPostDescription: this.props.editPostDescription,
            loading: false,
        })
    }

    updatePost(event) {
        event.preventDefault();

        const parameters = {
            title: this.state.editPostTitle,
            description: this.state.editPostDescription,
            id: this.state.editPostId,
        };

        axios.put('http://127.0.0.1:8000/api/update', parameters).then(response => {
            if (response.data.status) {
                this.props.onSuccessCallBack();
                this.setState({
                    loading: true,
                })
            } else {
                const errorM = response.data.message || 'General error';

                this.setState({
                    errorM: errorM,

                });
            }
        }).catch(function (error) {
        });
    }

    render() {
        const {errorM} = this.state;

        return (
            <div>
                <div>
                    <Button
                        variant="primary"

                        onClick={() => {
                            this.showHideModal(
                                this.props.editPostId,
                                this.props.editPostTitle,
                                this.props.editPostDescription);
                        }}> Edit
                    </Button>
                </div>

                <Modal show={this.state.showHide}>
                    <Modal.Header closeButton onClick={() => this.showHideModal()}>
                        <Modal.Title>Edit post</Modal.Title>
                    </Modal.Header>

                    <div>
                        {errorM ? (
                            <div>
                                <p style={{color: "red"}}>{this.state.errorM}</p>
                            </div>
                        ) : ''}
                    </div>

                    <form key={this.state.editPostId}>
                        <Modal.Body>
                            <div id="title">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="editPostTitle"
                                    defaultValue={this.state.editPostTitle}
                                    // value={post.title}
                                    onChange={this.setData}
                                    placeholder="Title"/>
                            </div>
                            <div id="description">
                                <label>Description</label>
                                <input
                                    type="text"
                                    name="editPostDescription"
                                    defaultValue={this.state.editPostDescription}
                                    onChange={this.setData}
                                    placeholder="Description"/>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => this.showHideModal()}>
                                Close
                            </Button>

                            <Button
                                variant="primary"
                                onClick={this.updatePost}
                                disabled={this.state.loading}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default EditPostModal;