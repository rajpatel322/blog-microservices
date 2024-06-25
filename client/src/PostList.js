import React, {useState, useEffect} from "react";
import axios from 'axios';
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
    const [posts, setPosts] = useState({});
    const fetchPosts = async () => {
        const res = await axios.get("http://posts.com/posts");
        // console.log(res.data);
        setPosts(res.data);
    };

    // using useEffect, we make sure that we run fetchPosts when the component is first display
    useEffect(() => {
        fetchPosts();
    }, []); // empty [] tells react to only run it one time

    // looping over the posts json object and use higher order function to create div component
    const renderedPosts = Object.values(posts).map(post => {
        return (<div className="card" style={{width: '30%', marginBottom: '30px'}} key={post.id}>
            <div className="card-body">
                <h3>
                    {post.title}
                </h3>
                <CommentList comments={post.comments}/>
                <CommentCreate postID={post.id}/>
                
            </div>

        </div>);
    });

    return (
        <div className="d-flex flex-row flex-wrap justify-content-evenly">
            {renderedPosts}
        </div>
    );
};

export default PostList;
