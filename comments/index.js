const express = require("express");
const bodyParser = require("body-parser");
const {randomBytes} = require("crypto");
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostID = {}; // key => ID of a post, value => Array of comments

app.get('/posts/:id/comments', (req,res) => {
    res.send(commentsByPostID[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) =>{
    const commentID = randomBytes(4).toString('hex');
    const {content} = req.body;

    const comments = commentsByPostID[req.params.id] || []; // req.params.id will try to find id parameter in a route handler. If can't then it will return empty array

    comments.push({id: commentID,
        content,
        status: 'pending'
    });

    

    commentsByPostID[req.params.id] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentID,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    }).catch((err) => {
        console.log(err.message);
    });

    res.status(201).send(comments);
});

app.post('/events', async (req,res) => {
    console.log("Event Received", req.body.type);

    const {type, data} = req.body;

    if(type === 'CommentModerated') {
        const {postId, id, status, content} = data;

        const comments = commentsByPostID[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content
            }
        });
    }
    res.send({});
});

app.listen(4001, ()=>{
    console.log("Listening to 4001");
})