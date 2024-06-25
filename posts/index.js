const express = require('express'); // get access to express module
const bodyParser  = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express(); // create an express object

app.use(cors());
app.use(bodyParser.json());

const posts = {}; // local store (Temp for now)


app.get('/posts', (req, res) =>{
    res.send(posts); // send post to result 
}); 

app.post('/posts/create', async (req, res) =>{
    const id = randomBytes(4).toString('hex');
    // console.log(req.body);
    const {title} = req.body; // get the user's information

    // add key and value to the dic/map
    posts[id] = {
        id,
        title
    };

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    }).catch((err) => {
        console.log(err.message);
    });

    res.status(201).send(posts[id]); // 201 -> created a resource
});


app.post('/events', (req,res) => {
    console.log("Received Event", req.body.type);

    res.send({});
});

app.listen(4000, ()=>{
    console.log("Listening on 4000");
})
