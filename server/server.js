const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//import jwt
const jwt = require('jsonwebtoken');
const webapp = express();
webapp.use(cors());
webapp.use(bodyParser.json({limit: '2MB'}))

const port = 8080;

//secret key
const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZfhd';

webapp.use(express.urlencoded({ extended: true }));
webapp.use(bodyParser.json({limit: '2MB'}));

const auth = require("./auth")
const dbLib = require('./dbFunctions');
let db;

webapp.listen(port, async () => {
    db = await dbLib.connect();
    console.log(`Server running on port: ${port}`);
});

webapp.get('/', (req, resp) => {
    resp.json({ message: 'welcome to our backend!!!' });
});

webapp.get('/login/:username/:password', async (req, res) => {
    try {
        const results = await dbLib.loginAuth(db, req.params.username, req.params.password);
        const jwtoken = jwt.sign({username: req.params.username }, secret, { expiresIn: '1800s'})
        res.status(201).json({data: results, token: jwtoken});
        res.end()
    } catch (err) {
        res.status(404).json({ error: 'there was error' });
    }
});

webapp.get('/suggested/:userid', async (req, res) => {
    try {
        console.log('server.js line 46: ', req.params.userid)
        const results = await dbLib.getSuggested(db, req.params.userid);
        console.log('server.js line 48: ', results)
        
        // send the response with the appropriate status code
        if(results === undefined) {
            res.status(404).json({ message: 'User not found in database' });
        } else {
            res.status(200).json({ data: results });
        }

    } catch {
        res.status(404).json({ error: 'there was error' });
    }

})


webapp.get('/posts/:postid', async (req, res) => {
    try {
        const results = await dbLib.getPost(db, req.params.postid);

        // send the response with the appropriate status code
        if(results === undefined) {
            res.status(404).json({ message: 'Post not found in database' });
        } else {
            res.status(200).json({ data: results });
        }

    }catch (err) {
        res.status(404).json({ error: 'there was error' });
      }
});

  
webapp.get('/getFeed/:userid', async (req, res) => {
    const val = auth.authenticateUser(req.headers.authorization, secret)
    if(val){
        try {
            // get the data from the db
            let results = []
            const userData = await dbLib.getUser(db, req.params.userid)
            for(i=0;i<userData.following.length;i++){
              let res = await dbLib.getPosts(db, userData.following[i])
              if(res != null) {
                  results = results.concat(res)
              }
            }

            res.status(201).json({ data: results });
          } catch (err) {
            res.status(404).json({ error: 'there was error' });
          }
    } else {
        res.status(401).json({ error: 'failed authentication' });
    }
});

webapp.post('/users', async (req, res) => {
    // Creating a new user
    try {
      // Adding a user to the DB
      const results = await dbLib.addUser(db, req.body);
      // send the response with the appropriate status code
      // console.log("Printing server results", results)
      res.status(201).json({ data: results });
    } catch (err) {
      res.status(400).json({ error: 'there was error' });
    }
});

webapp.post('/posts', async (req, res) => {
    // Creating a new post
    try {
        const results = await dbLib.addPost(db, req.body);
        res.status(201).json({ postdata: results });
    } catch (err) {
        res.status(400).json({ error: 'there was error' });
    }
})

// TODO: PUT THIS IN /POST/POSTID
webapp.put('/getFeed/comment/:id', async (req, res) => {
    try {
      const results = await dbLib.addComment(db, req.params.id, req.body.comments);
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ error: 'there was error' });
    }
});

webapp.put('/posts/:postId', async(req, res) =>{
    // Updating likes, comments, caption for a particular post id
    try{
        const results = await dbLib.likeStatus(db, req.params.postId, req.body.likes);
        res.status(200).json({ data: results});
    } catch (err) {
        res.status(400).json({ error: 'there was error' });
    }
});

webapp.put('/users/:id', async (req, res) => {
    // Updating following, followers, postList for a particular user id
    try {
        const results = await dbLib.updateUser(db, req.params.id, req.body);
        res.status(200).json({ data: results });
    } catch (err) {
        res.status(400).json({ error: 'there was error' });
    }
})

webapp.put('/posting/:id', async (req, res) => {
    // edit caption
    try {
        const results = await dbLib.updateCaption(db, req.params.id, req.body);
        res.status(200).json({ data: results });
    } catch (err) {
        res.status(400).json({ error: 'there was error' });
    }
})

webapp.put('/usering/:id', async (req, res) => {
    // Updating following, followers, postList for a particular _id
    try {
        const results = await dbLib.followUnfollow(db, req.params.id, req.body);
        res.status(200).json({ data: results });
    } catch (err) {
        res.status(400).json({ error: 'there was error' });
    }
})

webapp.put('/userings/:id', async (req, res) => {
    // Updating following, followers, postList for a particular _id
    try {
        const results = await dbLib.followUnfollows(db, req.params.id, req.body);
        res.status(200).json({ data: results });
    } catch (err) {
        res.status(400).json({ error: 'there was error' });
    }
})

webapp.get('/user/:userID', async(req, res) =>{
    try{
        const results = await dbLib.getUser(db, req.params.userID);
        res.status(200).json({ data: results});
    } catch (err) {
        res.status(400).json({ error: 'there was error' });
    }
});


webapp.get('/users', async(req, resp) => {
    // Get all users in the database
    try {
        // get the data from the db
        const results = await dbLib.getUsers(db);
        // send the response with the appropriate status code
        resp.status(200).json({ data: results});
    } catch (err) {
        resp.status(404).json({ error: 'there was error' });
    }
});

webapp.get('/users/:id', async (req, res) => {
    // Get a particular user based on id
    try {
        // get the data from the db
        const results = await dbLib.getUser(db, req.params.id);

        // send the response with the appropriate status code
        if(results === undefined) {
            res.status(404).json({ message: 'User not found in database' });
        } else {
            res.status(200).json({ data: results });
        }

    } catch(err) {
        res.status(404).json({ error: 'there was error' });
    }

})

webapp.get('/usering/:id', async (req, res) => {
    // Get a particular user based on username
    try {
        // get the data from the db
        const results = await dbLib.getUnique(db, req.params.id);
        // send the response with the appropriate status code
        res.status(200).json({ data: results });
    } catch(err) {
        res.status(404).json({ error: 'there was error' });
    }

})

webapp.delete('/posts/:postid', async (req, res) => {
    console.log('DELETE a post');
    try {
      const result = await dbLib.deletePost(db, req.params.postid);
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ error: 'there was error while deleting the post' });
    }
});

webapp.delete('/users/:username/:id', async (req, res) => {
    console.log('DELETE a post');
    try {
        const result = await dbLib.deletePostFromUser(db, req.params.username, req.params.id);
        // send the response with the appropriate status code
        res.status(200).json({ message: result });
    } catch (err) {
        res.status(404).json({ error: 'there was error while deleting the post' });
    }
});

module.exports = webapp;

