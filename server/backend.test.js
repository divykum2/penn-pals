const request = require('supertest');
const { closeMongoDBConnection, connect } = require('./dbFunctions');
const jwt = require('jsonwebtoken');
const webapp = require('./server');
const auth = require('./auth')
const { ObjectId } = require('mongodb');

let mongo;
beforeAll(async () => {
  db = await connect();
});


describe('All endpoints integration testing', () => {

    let db;
    let testUserID;
    let testPostID;

    // test resources to create / expected response
    const testUser = {
        firstname: 'Rich',
        lastname: 'Griswald',
        email: 'griswald@upenn.edu',
        userid: 'Grizzy557',
        password: 'SRK8975!',
        bio : 'Professional chef',
        posts : [],
        followers : [],
        following : [],
        notifications : []
    };

    const testPost = {
        username: 'Grizzy557',
        post_type: 'visual',
        caption: 'Bacon-wrapped pesto pork tenderloin',
        likes: [],
        comments: [],
        tags: [],
        posting: 'imageData'
    }

    beforeAll(async () => {
        db = await connect();
        let res = await request(webapp).post('/users')
          .send(testUser);
  
        // eslint-disable-next-line no-underscore-dangle
        testUserID = JSON.parse(res.text).data.insertedId;

        res = await request(webapp).post('/posts')
        .send(testPost);
    
        // eslint-disable-next-line no-underscore-dangle
        testPostID = JSON.parse(res.text).postdata.insertedId;
    });
    
    const clearDatabase = async () => {
        try {
            let result = await db.collection('users').deleteMany({ userid: 'Grizzy557' });
            let { deletedCount } = result;
            if (deletedCount === 1) {
            console.log('info', 'Successfully deleted test user');
            } else {
            console.log('warning', 'test user was not deleted');
            }

            result = await db.collection('posts').deleteMany({ username: 'Grizzy557' });
            deletedCount = result;
            if (deletedCount === 1) {
            console.log('info', 'Successfully deleted test posts');
            } else {
            console.log('warning', 'test posts were not deleted');
            }

        } catch (err) {
            console.log('error', err.message);
        }
    };

    /**
     * Delete all test data from the DB
     * Close all open connections
     */
    afterAll(async () => {
        await clearDatabase();
        try {
            // await close(db);
            await closeMongoDBConnection(); // mongo client that started server.
            return
        } catch (err) {
            return err;
        }
    });

    test('Get all users endpoint status code and data', async () => {
        const resp = await request(webapp).get('/users');
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        const userArr = JSON.parse(resp.text).data;
        // testUser is in the response
        expect(userArr).toEqual(expect.arrayContaining([{ _id: testUserID, ...testUser }]));
    });
  
    test('Get a single user endpoint status code and data', async () => {
        console.log("testUserID: ", testUserID)
        const resp = await request(webapp).get(`/users/${testUserID}`);
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        console.log(resp.text)
        const retrievedUser = JSON.parse(resp.text).data;

        expect(retrievedUser).toMatchObject({ _id: testUserID, ...testUser });
    });

    test('Get a single user by username endpoint status code and data', async () => {
        const resp = await request(webapp).get(`/usering/${testUser.userid}`);
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        const retrievedUser = JSON.parse(resp.text).data;
        expect(retrievedUser).toMatchObject({ _id: testUserID, ...testUser });
    })

    test('Update follow endpoint status code and data', async () => {
      const resp = await request(webapp).put(`/usering/${testUserID}`).send({followers: ['Susan Bower']})
      expect(resp.status).toEqual(200);
      expect(resp.type).toBe('application/json');
      
      // the database was updated
      const updatedUser = await db.collection('users').findOne({ _id: ObjectId(testUserID) });
      // console.log(updatedUser.posts)
      expect(updatedUser.followers).toEqual(['Susan Bower']);
  })

  test('Update follow by username endpoint status code and data', async () => {
      const resp = await request(webapp).put(`/userings/${testUser.userid}`).send({followers: ['Phillip Marsh']})
      expect(resp.status).toEqual(200);
      expect(resp.type).toBe('application/json');
      
      // the database was updated
      const updatedUser = await db.collection('users').findOne({ _id: ObjectId(testUserID) });
      // console.log(updatedUser.posts)
      expect(updatedUser.followers).toEqual(['Phillip Marsh']);
  })
  
    test('User not in DB status code 404', async () => {
        const resp = await request(webapp).get('/users/1');
        expect(resp.status).toEqual(404);
        expect(resp.type).toBe('application/json');
    });

    test('Get a post endpoint status code and data', async () => {
        const resp = await request(webapp).get(`/posts/${testPostID}`);
        expect(resp.status).toEqual(200);
        expect(resp.type).toBe('application/json');
        const retrievedPost = JSON.parse(resp.text).data;
        // retrievedPost is in the response
        expect(retrievedPost).toEqual(expect.arrayContaining([{ _id: testPostID, ...testPost }]));
      });

    test('Post not in DB status code 404', async () => {
        const resp = await request(webapp).get('/posts/1');
        expect(resp.status).toEqual(404);
        expect(resp.type).toBe('application/json');
    });

    test('Endpoint status code and response async/await for updating post list', async () => {
        res = await request(webapp).put(`/users/${testUserID}`)
          .send({postArr: ['557']});
        expect(res.status).toEqual(200);
        expect(res.type).toBe('application/json');
    
        // the database was updated
        const updatedUser = await db.collection('users').findOne({ _id: ObjectId(testUserID) });
        // console.log(updatedUser.posts)
        expect(updatedUser.posts).toEqual(['557']);
    });
  
      test('Endpoint status code and response async/await for updating followers array', async () => {
        res = await request(webapp).put(`/users/${testUserID}`)
          .send({followersArr: ['Emeril Lagasse']});
        expect(res.status).toEqual(200);
        expect(res.type).toBe('application/json');
    
        // the database was updated
        const updatedUser = await db.collection('users').findOne({ _id: ObjectId(testUserID) });
        // console.log(updatedUser.posts)
        expect(updatedUser.followers).toEqual(['Emeril Lagasse']);
    });
  
      test('Endpoint status code and response async/await for updating following array', async () => {
        res = await request(webapp).put(`/users/${testUserID}`)
          .send({followingArr: ['Giada De Laurentiis']});
        expect(res.status).toEqual(200);
        expect(res.type).toBe('application/json');
    
        // the database was updated
        const updatedUser = await db.collection('users').findOne({ _id: ObjectId(testUserID) });
        // console.log(updatedUser.posts)
        expect(updatedUser.following).toEqual(['Giada De Laurentiis']);
    });

    test('Endpoint status code and response async/await for updating likes', async () => {
        res = await request(webapp).put(`/posts/${testPostID}`)
          .send({likes: ['505']});
        expect(res.status).toEqual(200);
        expect(res.type).toBe('application/json');
    
        // the database was updated
        const updatedPost = await db.collection('posts').findOne({ _id: ObjectId(testPostID) });
        // console.log(updatedUser.posts)
        expect(updatedPost.likes).toEqual(['505']);
      });
  
    test('Endpoint status code and response async/await for updating comments', async () => {
        res = await request(webapp).put(`/getFeed/comment/${testPostID}`)
            .send({comments: ['More lamb sauce!']});
        expect(res.status).toEqual(200);
        expect(res.type).toBe('application/json');
    
        // the database was updated
        const updatedPost = await db.collection('posts').findOne({ _id: ObjectId(testPostID) });
        // console.log(updatedUser.posts)
        expect(updatedPost.comments).toEqual(['More lamb sauce!']);
    });

    test('Endpoint status code and response async/await for login', async () => {
      res = await request(webapp).get(`/login/admin/admin`)
      expect(res.status).toEqual(201);
      expect(res.type).toBe('application/json');
  
      // the database was updated
      result = await db.collection('users').findOne({userid: "admin"});
      // console.log(updatedUser.posts)
      expect(result["password"]).toEqual("admin");

      result1 = await db.collection('users').findOne({userid: "Grizzy55"});

      expect(result1).toEqual(null);

    });

    test('Testing auth', () => {
      secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZfhdkkk';

      jwtoken = jwt.sign({username : "admin"}, secret, {expiresIn: "60s"})
      res = auth.authenticateUser(jwtoken, secret)
      expect(res).toBe(true)

      jwtoken1 = jwt.sign({username : "admin"}, secret, {expiresIn: "60s"})
      res1 = auth.authenticateUser(null, secret)
      expect(res1).toBe(false)

    })

});