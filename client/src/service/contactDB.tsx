
import axios from "axios";

const baseURL1 = "http://localhost:8080"

const api = axios.create({baseURL: baseURL1})

api.interceptors.request.use(config => {
    if(config && config.headers){
        config.headers['Authorization'] =`${sessionStorage.getItem('jwt')}`;
    }

    return config;
    
});

const reAuthenticate = (status: number) => {
    console.log("serving status 401", status)
    if(status === 401){
      // delete the token
      sessionStorage.removeItem("jwt")
      localStorage.removeItem("userid")
      //reload the app
    //   window.location.reload();
    }
}

export const getAllUsers = async () => {
    try{
        const results = await fetch(`${baseURL1}/users`, {
            headers: {
              'Authorization': `${sessionStorage.getItem('jwt')}`
            },
        }).then(res => {return res.json()});
        return results.data
    } catch(err){
        console.error(err); 
        reAuthenticate(401);
    }
}

export const getPost = async ({postid}: any) => {

    try{
        const results = await fetch(`${baseURL1}/posts/${postid}`, {
            headers: {
              'Authorization': `${sessionStorage.getItem('jwt')}`
            },
        }).then(res => {return res.json()});
        return results.data
    } catch(err) {
        console.error(err); 
        reAuthenticate(401);
    }
}

// no need to change this getFeed function
export const getAllPosts = async (userID: any) => {
    try {
        const results = await fetch(`${baseURL1}/getFeed/${userID}`, {
            headers: {
              'Authorization': `${sessionStorage.getItem('jwt')}`
            },
          }).then(res => {return res.json()});
        console.log("printing allposts", results)
        if(results.error){
            reAuthenticate(401)
            return 
        }
        reAuthenticate(results.status)
        return results.data
    } catch(err) {
        console.error(err); 
        reAuthenticate(401);
    }
}

export const getUser = async (userid: any) => {
    try {
        let user = {
            "userid": "",
            "firstname": "",
            "lastname": "",
            "email": "",
            "phonenum": "",
            "password": "",
            "display_picture": "",
            "bio": "",
            "posts": [],
            "followers": [],
            "following": [],
            "notification": [
                {
                "userid": "",
                "notification_id": "",
                "datetime": "",
                "follower_email": ""
                }
            ],
            "loginstatus": ""
        }
        
        await api.get(`/user/${userid}`).then(res => user = res.data );
        return user
    } catch(err) {
        console.error(err); 
        reAuthenticate(401);
    }
}

export const updateFollowing = async ({userid, followingArr}: any) => {
    try {
        await api.put(`/user/${userid}`, {
            following: followingArr
        });
    } catch(err) {
        console.error(err); 
        reAuthenticate(401);
    }
}

export const updatedFollowers = async ({userid, followersArr}: any) => {
    try{
        await api.put(`/user/${userid}`, {
            followers: followersArr
        });
    } catch(err) {
        console.error(err); 
        reAuthenticate(401);
    }
}

export const updateLikes = async ({postid, likesArr}: any) => {
    try {
        await api.put(`/getFeed/${postid}`, {
            likes: likesArr
        });
    } catch(err) {
        console.error(err); 
        reAuthenticate(401);
    }
}

export const addPost = async ({post}: any) => {
    try{
        await api.post(`/getFeed`, {post}).then((response: any) => {return response});
    } catch(err){
        console.error(err); 
        reAuthenticate(401);
    }
}

export const addUser = async ({firstName, lastName, email, userID, password}: any) => {

    try {
        const result = await fetch(`${baseURL1}/users`, {
            method: 'POST',
            body: JSON.stringify({
                firstname: firstName,
                lastname: lastName,
                email: email,
                userid: userID,
                password: password,
                bio : "",
                posts : [],
                followers : [],
                following : [],
                notifications : []
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${sessionStorage.getItem('jwt')}`
            },
        })

        return result
    } catch(err) {
        console.error(err); 
        reAuthenticate(401);
    }
}

export const getSuggested = async () => {}