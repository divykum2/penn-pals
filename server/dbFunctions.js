// import the mongodb driver
const { MongoClient, ServerApiVersion } = require('mongodb');

// import ObjectID
const { ObjectId } = require('mongodb');

const dbURL = "mongodb+srv://ffattori:Lithium1201@cluster0.8j8pi02.mongodb.net/pennpals?retryWrites=true&w=majority"

let MongoConnection;

// connection to the db
const connect = async () => {
    // always use try/catch to handle any exception
    try {

      MongoConnection = (await MongoClient.connect(
        dbURL,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 },
      ))
      
      con = MongoConnection.db();
      // check that we are connected to the db
      console.log(`connected to db: ${con.databaseName}`);
      // console.log(JSON.stringify(con))
      return con;
    } catch (err) {
      console.log(err.message);
    }
  };

const closeMongoDBConnection = async () => {
  await MongoConnection.close();
  console.log("in DB closing connection")
};


const addUser = async (db, newUser) => {
  try {
    const result = db.collection('users').insertOne(newUser);
    return result
  } catch(err) {
    console.log(`Error : ${err.message}`);
  }
};

const addPost = async (db, newPost) => {
  try {
    const result = db.collection('posts').insertOne(newPost);
    return result;
  } catch(err) {
    console.log(`Error : ${err.message}`);
  }
}

const getSuggested = async (db, userid) => {
  try {
    let imp = []
    const result = await db.collection('users').findOne({ _id: ObjectId(userid) });
    console.log("line 60", result)
    const loggedInFollowers = result["following"];
    console.log("Line 62", result["following"])

    const allIDs = await db.collection('users').distinct('userid',{},{})
    console.log("line 65", allIDs)
    
    const allNonFollowers = allIDs.filter((x) => !loggedInFollowers.includes(x))
    console.log("dbFunctions.js line 66: ", allNonFollowers)

    for (let i = 0; i < allNonFollowers.length; i=i+1) {
      const otherUser = await db.collection('users').findOne({ userid: allNonFollowers[i]})
      const otherUserFollowing = otherUser["following"];
      console.log("dbFunctions.js lin 67: ", otherUserFollowing)

      data = [loggedInFollowers, otherUserFollowing]
      similar = data.reduce((a, b) => a.filter(c => b.includes(c)));
      if(similar.length >= 3 && allNonFollowers[i] !== result["userid"]){
        imp.push(otherUser.firstname + " " + otherUser.lastname)
      }
    }

    console.log('dbFunctions.js line 74: ', imp)
    return imp;

  } catch(err) {
    console.log(`Error : ${err.message}`);
  }
}

const getPosts = async (db, username) => {
  try {
    // console.log("printing all posts by this user", username)
    const result = await db.collection('posts').find({ username: username, visible: true }).toArray();
    // console.log("printing all posts by this user", result)
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const getPost = async (db, postid) => {
  try {
    const result = await db.collection('posts').find({ _id: ObjectId(postid)}).toArray();
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const getUser = async (db, userID) => {
  try {
    // const result = await db.collection('users').find({}).toArray();
    const result = await db.collection('users').findOne({ _id: ObjectId(userID) });
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
}

const getFeed = async (db) => {
  try {
    const result = await db.collection('posts').find({}).toArray();
    // print the results
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const getUsers = async (db) => {
  try {
    const result = await db.collection('users').find({}).toArray();
    // print the results
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

  const getUnique = async (db, userName) => {
    try {
      const result = await db.collection('users').findOne({ userid: userName });
      return result
    } catch (err) {
      console.log(`error: ${err.message}`);
    }
  };

  const addComment = async (db, postID, comments) => {
    // callback version
    try {
      const result = await db.collection('posts').updateOne(
        { _id: ObjectId(postID) },
        { $set: {comments: comments} },
      );
    } catch(err) {
        console.log(`Error: ${err.message}`);
    }
  };

const loginAuth = async (db, userName, password) => {
  let num = 0
  try {
    let pass = ""
    const result = await db.collection('users').findOne({userid: userName});
    num = 1
    pass = result["password"]
    if(password === pass){
    // print the result
    num = 2
    }
    return {first: num, second: result};
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return {first: 0};
  }
};

const likeStatus = async (db, postId, likeArray) => {
  try{
    const result = await db.collection('posts').updateOne(
      {_id: ObjectId(postId)},
      {$set: {likes: likeArray}},
    );
    return result;
  }
  catch(err){
    console.log(`Error: ${err.message}`);
  }
};

const updateCaption = async (db, id, captions) => {
  try{
    const result = await db.collection('posts').updateOne(
      {_id: ObjectId(id)},
      {$set: {caption: captions.caption}},
    );
    return result;
  }
  catch(err){
    console.log(`Error: ${err.message}`);
  }
};

const updateUser = async (db, userId, updatedInfo) => {
  try {
    if(updatedInfo.postArr) {
      const result = await db.collection('users').updateOne(
        {_id: ObjectId(userId)},
        {$set: {posts: updatedInfo.postArr}},
      );
      return result;
    } else if (updatedInfo.followingArr) {
      const result = await db.collection('users').updateOne(
        {_id: ObjectId(userId)},
        {$set: {following: updatedInfo.followingArr}},
      );
      return result;
    } else if (updatedInfo.followersArr) {
      const result = await db.collection('users').updateOne(
        {_id: ObjectId(userId)},
        {$set: {followers: updatedInfo.followersArr}},
      );
      return result;
    } 
  } catch(err) {
      console.log(`Error: ${err.message}`);
  }
}
 
const deletePost = async (db, id) =>{
  try {
  const result = await db.collection('posts').deleteOne(
    { _id: ObjectId(id) }
  );
  // print the result
  return result;
} catch (err) {
  console.log(`error: ${err.message}`);
}
}

const deletePostFromUser = async (db, username, id) =>{
  try {
  const result2 = await db.collection('users').updateOne({ userid: username},
  { $pull: {posts :{ $in : [id]}}});
  // print the result 
  return result2;
} catch (err) {
  console.log(`error: ${err.message}`);
}
}

  const followUnfollow = async (db, Id, updatedInfo) => {
    try {
      if (updatedInfo.following) {
        const result = await db.collection('users').updateOne(
          {_id: ObjectId(Id)},
          {$set: {following: updatedInfo.following}},
        );
        return result;
      } else if (updatedInfo.followers) {
        const result = await db.collection('users').updateOne(
          {_id: ObjectId(Id)},
          {$set: {followers: updatedInfo.followers}},
        );
        return result;
      } 
    } catch(err) {
        console.log(`Error: ${err.message}`);
    }
  }

  const followUnfollows = async (db, Id, updatedInfo) => {
    try {
      if (updatedInfo.following) {
        const result = await db.collection('users').updateOne(
          {userid: Id},
          {$set: {following: updatedInfo.following}},
        );
        return result;
      } else if (updatedInfo.followers) {
        const result = await db.collection('users').updateOne(
          {userid: Id},
          {$set: {followers: updatedInfo.followers}},
        );
        return result;
      } 
    } catch(err) {
        console.log(`Error: ${err.message}`);
    }
  }

  module.exports = {
    getSuggested, updateCaption, deletePostFromUser, deletePost, connect, followUnfollow, followUnfollows, getFeed, getUnique, getPost, getUsers, addComment, loginAuth, addUser, likeStatus, addPost, updateUser, getPosts, getUser, closeMongoDBConnection
  };
