import React, {Component} from 'react';
import axios from 'axios';

class DeletePost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            loading: false,
        }
    }

    deletePost(id) {
        axios.post('http://127.0.0.1:8000/api/delete/' + id, {id}).then(res => {
            if (res.data.status) {
                this.props.onSuccessCallBack();
                this.setState({
                    loading: true,
                })
            }
        });
    }

    render() {
        return (
            <div>
                <button
                    disabled={this.state.loading}
                    onClick={() => this.deletePost(this.props.id)}
                >Delete
                </button>
            </div>
        )
    }
}

export default DeletePost;