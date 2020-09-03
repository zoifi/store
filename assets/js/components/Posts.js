import React, {Component} from 'react';

import axios from 'axios';
import EditPostModal from './postComponents/EditPostModal';
import {Button} from "react-bootstrap";
import AddNewPost from "./postComponents/AddNewPost";
import DeletePost from "./postComponents/DeletePost";

class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            posts: [],
            post: [],
            pages: '',
            currentPage: 1,
            postPerPage: 5,
            optionPostPerPage: [1, 5, 10, 15, 20],
        };
        this.onClickPage = this.onClickPage.bind(this);
        this.onSelectPostPerPage = this.onSelectPostPerPage.bind(this);
    }

    componentDidMount() {
        this.getPosts();
    }

    getPosts() {
        const data = {
            currentPage: this.state.currentPage,
            postsPerPage: this.state.postPerPage,
        }

        axios.post('http://127.0.0.1:8000/api/posts', data).then(res => {
            const posts = res.data.posts;
            const pages = res.data.pages;

            this.setState({
                posts,
                loading: false,
                pages,
            })
        })
    }

    onSelectPostPerPage(event) {
        this.setState({
            postPerPage: event.target.value
        }, () => {
            this.getPosts();

        });
    }

    onClickPage(event) {
        this.setState({
            currentPage: parseInt(event.target.id)
        }, () => {
            this.getPosts();
        });
    }

    renderPagination() {
        let pagination = [];

        for (let i = 1; i <= this.state.pages; i++) {
            pagination.push(
                <Button
                    variant={i === this.state.currentPage ? "default" : 'primary'}
                    id={i}
                    key={i}
                    onClick={this.onClickPage}
                > {i} </Button>);
        }

        return (
            <React.Fragment>
                <div className="col-md-10 offset-md-1 row-block">

                    <select value={this.state.postPerPage} onChange={this.onSelectPostPerPage}>
                        {this.state.optionPostPerPage.map(item =>
                            <option
                                key={item}
                                value={item}
                            >{item} </option>
                        )}
                    </select>

                    {pagination}

                </div>
            </React.Fragment>
        );
    }

    render() {
        const {loading} = this.state;

        return (
            <div>
                <section className="row-section">
                    <div className="container">
                        <div className="row">
                            <h2 className="text-center"><span>List of posts</span>Created with <i
                                className="fa fa-heart"></i> by yemiwebby </h2>
                        </div>

                        {loading ? (
                            <div className={'row text-center'}>
                                <span className="fa fa-spin fa-spinner fa-4x"></span>
                            </div>

                        ) : (
                            <div className={'row'}>
                                <div className="col-md-10 offset-md-1 row-block">
                                    <ul id="sortable">
                                        <li>
                                            <div className="media">
                                                <AddNewPost onSuccessCallBack={() => {
                                                    this.getPosts()
                                                }}/>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {this.renderPagination()}

                                {this.state.posts.map(post =>
                                    <div className="col-md-10 offset-md-1 row-block" key={post.id}>
                                        <ul id="sortable">
                                            <li>
                                                <div className="media">
                                                    <div className="media-body">
                                                        <h4>{post.title}</h4>
                                                        <p>{post.description}</p>
                                                    </div>

                                                    <EditPostModal
                                                        editPostId={post.id}
                                                        editPostTitle={post.title}
                                                        editPostDescription={post.description}
                                                        onSuccessCallBack={() => {
                                                            this.getPosts()
                                                        }}
                                                    />

                                                    <DeletePost id={post.id} onSuccessCallBack={() => {
                                                        this.getPosts()
                                                    }}/>

                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        )
    }
}

export default Posts;