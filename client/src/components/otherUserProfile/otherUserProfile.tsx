import * as React from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar'
import './otherUserProfile.css'
import ActivityFeed from '../activityFeed/activityFeed';
import logo from "../../assets/logo.png";
import ProfilePost from '../profilePost/profilePost';
import axios from "axios"
import { getAllPosts } from '../../service/contactDB';

const api = axios.create({baseURL: "http://localhost:8080"});

api.interceptors.request.use(config => {
    if(config && config.headers){
        config.headers['Authorization'] =`${sessionStorage.getItem('jwt')}`;
    }

    return config;
    
});

const navItems = [
  {
      "name": "Notifications",
      "value": "notifications"
  },
  {
      "name": "Feed",
      "value": "feed"
  },
  {
      "name": "Logout",
      "value": "logout"
  }
];

function OtherUserProfile() {

    const navigate = useNavigate();
    const { loggedInUser } = useParams();
    const { otherUser } = useParams();

    let flag: Boolean;
    

    const [loggedUserData, setLoggedUserData] = React.useState({
        "userid": "",
        "firstname": "",
        "lastname": "",
        "email": "",
        "phonenum": "",
        "password": "",
        "display_picture": "",
        "bio": "",
        "posts": [],
        "followers": [""],
        "following": [""],
        "notification": [
            {
            "userid": "",
            "notification_id": "",
            "datetime": "",
            "follower_email": ""
            }
        ],
        "loginstatus": ""
    })

    const [otherUserData, setOtherUserData] = React.useState({
        "userid": "",
        "firstname": "",
        "lastname": "",
        "email": "",
        "phonenum": "",
        "password": "",
        "display_picture": "",
        "bio": "",
        "posts": [],
        "followers": [""],
        "following": [""],
        "notification": [
            {
            "userid": "",
            "notification_id": "",
            "datetime": "",
            "follower_email": ""
            }
        ],
        "loginstatus": ""
    })

    if(sessionStorage.getItem("jwt") !== null){
        flag =  true
    }

    const [followValue, setFollowValue] = React.useState('Unfollow');
    let followingArrForLogged : any[];
    let otherUserID = "Harry_Sandhu";
    React.useEffect(() => {
        const fetchData = async () => {
            
            await api.get(`users/${loggedInUser}`).then(res => { 
                setLoggedUserData(res.data.data);
                // eslint-disable-next-line react-hooks/exhaustive-deps
                followingArrForLogged = res.data.data.following
            });
            await api.get(`usering/${otherUser}`).then(res1 => { 
                setOtherUserData(res1.data.data);
                // eslint-disable-next-line react-hooks/exhaustive-deps
                otherUserID = res1.data.data.userid
            });
            if(followingArrForLogged.indexOf(otherUserID) === -1){
                setFollowValue("Follow")
            }
            else{
                setFollowValue("Unfollow")
            }

        };

        fetchData();
    },[]);

    const changeFollow = async () => {

        if (followValue === "Follow")  
        {
            let followingArr = loggedUserData["following"]
            followingArr.push(otherUserData["userid"])
            let followersArr = otherUserData["followers"]
            followersArr.push(loggedUserData["userid"])
            
            await api.put(`/usering/${loggedInUser}`, {
                following: followingArr
            })
            await api.put(`/userings/${otherUser}`, {
                followers: followersArr
            })
            
            setFollowValue("Unfollow");
        }
        else 
        {
            let followingArr = loggedUserData["following"]
            followingArr.splice(followingArr.indexOf(otherUserData["userid"]), 1)
            let followersArr = otherUserData["followers"]
            followersArr.splice(followingArr.indexOf(loggedUserData["userid"]), 1)

            
            await api.put(`/usering/${loggedInUser}`, {
                following: followingArr
            })

            await api.put(`/userings/${otherUser}`, {
                followers: followersArr
            })

            setFollowValue("Follow");
        }
    }

    const navigatePage = async (item: any) => {
        if (item === "FEED"){
            if(flag){
                const feedForUser = await getAllPosts(loggedInUser).then((data) => {return data})
                console.log("printing feed for user inside otheruserprofile", feedForUser)
                if(feedForUser.error){
                    sessionStorage.removeItem("jwt")
                    localStorage.removeItem("userid")
                    navigate(`/`)
                } else {
                    navigate(`/feed/${loggedInUser}`, {state: {feedForUser}})
                }
                
            } else {
                navigate('/')
            }
        } else if (item === "NOTIFICATIONS") {
            navigate('/')
        }
        else if(item === "LOGOUT"){
            sessionStorage.removeItem("jwt")
            localStorage.removeItem("userid")
            navigate("/")
    }
    }

    const postWrapper = otherUserData.posts.map((post) => (
        <ProfilePost postid={post} postofUser={false}/>
    ))

    return (
        <Grid container spacing={2} justifyContent="center" >
            <Grid item xs={12}>
              <Box sx={{ display: 'flex'}}>
                  <AppBar component="nav" style={{ background: 'white', opacity: "20"}}>
                      <Toolbar>
                          <Typography
                              variant="h5"
                              component="div"
                              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block', color: "#171F57", textAlign: "center", fontFamily: "cursive", fontWeight: "bold", fontSize: "40px" } }}
                          >
                              <img src={logo} alt="logo" height="40" />
                          </Typography>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                              {navItems.map((item) => (
                                  <Button key={item.value} onClick={(item) => navigatePage(item.currentTarget.innerText)} sx={{ color: '#7F190E' }}>
                                      {item.name}
                                  </Button>
                              ))}
                          </Box>
                      </Toolbar>
                  </AppBar>
              </Box>
          </Grid>
            <Grid container spacing={3} justifyContent="center" >
                <Grid 
                    item 
                    xs={3}
                    sx={{ display:'flex', justifyContent:'center'}}
                    alignItems="center"
                    justifyContent="center"
                    style={{ marginTop: '5%'}}
                >
                        <Avatar src={otherUserData["display_picture"]} sx={{ width: 250, height: 250, border: 4, borderColor: '#7F190E'}}/>
                </Grid>
                <Grid 
                    item 
                    xs={3}
                    style={{ marginTop: '5%' }}>
                    <Grid item sx={{ height: '85%'}}>
                        <Typography variant='h4' align='left' sx={{ fontWeight: 'bold' }}>{otherUserData["firstname"]}&nbsp;{otherUserData["lastname"]}</Typography>
                        <Typography variant='h6' align='left' sx={{ display: 'inline-block'}}>Username: </Typography>
                        <Typography variant='h6' align='left' sx={{ display: 'inline-block'}}>&nbsp;{otherUserData["userid"]}</Typography>
                        <br></br>
                        <div style={{textAlign: "left"}}>
                          <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'inline-block'}}>{otherUserData["followers"].length}&nbsp;</Typography>
                          <Typography variant='h6' sx={{ display: 'inline-block', marginLeft: "2%"}}>Followers</Typography>
                        </div>
                        <div style={{textAlign: "left"}}>
                          <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'inline-block'}}>{otherUserData["following"].length}&nbsp;</Typography>
                          <Typography variant='h6' sx={{ display: 'inline-block'}}>Following</Typography>
                        </div>
                        <Typography variant='h6' align='left'>{otherUserData["bio"]}</Typography>
                    </Grid>
                    <Grid item sx={{ display:'flex', alignItems:'flex-end'}}>
                    <ButtonGroup variant='contained' style={{ color:'primary', float:'left'}}>
                        <Button id='follow' style={{ backgroundColor: '#004C99', float:'left'}} onClick={changeFollow}>
                            {followValue}
                        </Button>
                    </ButtonGroup>
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid container spacing={2} justifyContent="center">
                <Grid 
                    item 
                    xs={4} 
                    sx={{ display:'flex', justifyContent:'center'}}
                    style={{ marginTop: '2%' }}
                >
                    <Typography variant='h6'>Photos</Typography>
                </Grid>
                <Grid 
                    item 
                    xs={2} 
                    sx={{ display:'flex', justifyContent:'center'}}
                    style={{ marginTop: '2%' }}
                >
                    <Typography variant='h6'>Status</Typography>
                </Grid>
            </Grid> */}
            <Grid container spacing={2} justifyContent="center">
                <Grid 
                    item 
                    xs={6} 
                    sx={{ justifyContent:'center'}}
                >
                    <Divider sx={{ p: 2, borderBottomWidth: 3, borderColor: '#7F190E' }}/>
                </Grid>
            </Grid>
            <Grid container spacing={1} justifyContent="center">
                <Grid 
                    item 
                    xs={4} 
                    sx={{display:'flex', justifyContent:'center'}}
                >
                    <Box sx={{ display: 'flex'}}>
                        <div>
                            {postWrapper}
                        </div>
                    </Box>
                </Grid>
            </Grid>
            <Routes>
              <Route path={`/feed/${loggedInUser}`} element={<ActivityFeed />} />
            </Routes>
        </Grid>
    );
}

export default OtherUserProfile;
