import React, {Component} from 'react';
import axios from 'axios';

class AddNewPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            error: [],
            loading: false,
            newPostTitle: '',
            newPostDescription: '',
        };
        this.addNewPost = this.addNewPost.bind(this);
        this.setData = this.setData.bind(this);
        this.resetDataAfterSubmit = this.resetDataAfterSubmit.bind(this);
    }

    setData(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value
        })
    }

    resetDataAfterSubmit() {
        this.setState({
            newPostTitle: '',
            newPostDescription: '',
            error: [],
        });
    }

    addNewPost(event) {
        event.preventDefault();

        const parameters = {
            title: this.state.newPostTitle,
            description: this.state.newPostDescription,
        };

        this.setState({
            loading: true,
        })

        axios.post('http://127.0.0.1:8000/api/create', parameters).then(response => {
            if (response.data.status) {
                this.props.onSuccessCallBack();
                this.resetDataAfterSubmit();

                this.setState({
                    loading: false,
                })
            } else {
                const error = response.data.message || 'General error';
                console.log(error);

                this.setState({
                    error: error,
                    loading: false,
                });
            }
        }).catch(function (error) {
        });
    }

    render() {
        const {error} = this.state;

        return (
            <div>
                {error ? (

                    <div>
                        <div style={{color: "red"}}>{Object.entries(error).map(([key, value]) => {
                            return (
                                <div key={key}>
                                    {value.id===""?'' : <div>Field: {value.id} </div>}
                                    <div> Message: {value.message}</div><br/>
                                </div>
                            )}
                        )
                        }
                        </div>
                    </div>
                ) : ''}
                <form>
                    <div className="media-body">
                        <div id="title">
                            <label>Title</label>
                            <input
                                type="text"
                                name="newPostTitle"
                                value={this.state.newPostTitle}
                                onChange={this.setData}
                                placeholder="Title"/>
                        </div>
                        <div id="description">
                            <label>Description</label>
                            <input
                                type="text"
                                name="newPostDescription"
                                value={this.state.newPostDescription}
                                onChange={this.setData}
                                placeholder="Description"/>
                        </div>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={this.addNewPost}
                            disabled={this.state.loading}
                        >Save
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default AddNewPost;