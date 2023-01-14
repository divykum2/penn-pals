import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar'
import './userProfile.css'
import ProfilePost from '../profilePost/profilePost'
import logo from "../../assets/logo.png";
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import ActivityFeed from '../activityFeed/activityFeed';
import { useLocation } from 'react-router-dom';
import { getAllPosts } from "../../service/contactDB";

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

function UserProfile() {
    const navigate = useNavigate();
    const { loggedInUser } = useParams();
    const location = useLocation();
    const userData = location.state;
    let flag: Boolean

    console.log("@@@@", sessionStorage.getItem("jwt"))
    
    const navigatePage = async (item: any) => {

        if(sessionStorage.getItem("jwt") !== null){
            flag =  true

        } else {
            navigate(`/`)
        }

        if (item === "FEED"){
            if(flag){
                try{
                    const feedForUser = await getAllPosts(loggedInUser).then((data) => {return data})
                    if(feedForUser.error){
                        sessionStorage.removeItem("jwt")
                        localStorage.removeItem("userid")
                        navigate(`/`)
                    } else {
                        navigate(`/feed/${loggedInUser}`, {state: {feedForUser}})
                    }
                    
                } catch(err) {
                    navigate("/")
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
    }}

    let postWrapper = []
    for(let i = 0; i < userData.posts.length; i++) {
        postWrapper.push(<ProfilePost postid={userData.posts[i]} postOfUser={true} />)
    }


    // const postWrapper = userData.posts.map((post) => (
    //     <ProfilePost postid={Number(post)} />
    // ))
  
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
                    <Avatar src={userData["display_picture"]} sx={{ width: 250, height: 250, border: 4, borderColor: '#7F190E'}}/>
                </Grid>
                <Grid 
                    item 
                    xs={3}
                    style={{ marginTop: '5%' }}
                >
                    <Grid item sx={{ height: '85%' }}>
                            <Typography id="firstName" variant='h3' align='left' sx={{ fontWeight: 'bold' }}>{userData["firstname"]}&nbsp;{userData["lastname"]}</Typography>
                            <Typography variant='h6' align='left' sx={{ display: 'inline-block'}}>Username: </Typography>
                            <Typography variant='h6' align='left' sx={{ display: 'inline-block'}}>&nbsp;{userData["userid"]}</Typography>
                            <br></br>
                            <Typography variant='h6' align='left' sx={{ fontWeight: 'bold', display: 'inline-block'}}>{userData["followers"].length}&nbsp;</Typography>
                            <Typography variant='h6' align='left' sx={{ display: 'inline-block'}}>Followers</Typography>
                            <br></br>
                            <Typography variant='h6' align='left' sx={{ fontWeight: 'bold', display: 'inline-block'}}>{userData["following"].length}&nbsp;</Typography>
                            <Typography variant='h6' align='left' sx={{ display: 'inline-block'}}>Following</Typography>
                            <Typography variant='h6' align='left'>{userData["bio"]}</Typography>
                    </Grid>
                    <Grid item sx={{ display:'flex', alignItems:'flex-end'}}>
                        <Button variant='contained' style={{ backgroundColor: '#004C99', float:'left'}} onClick = {() => navigate(`/addpost/${loggedInUser}`)}>
                            Add Post
                        </Button>
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
                    xs={3} 
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
            <Grid container spacing={2} justifyContent="center">
                <Grid 
                    item 
                    xs={6} 
                    sx={{display:'flex', justifyContent:'center'}}
                >
                    <Box sx={{ width: '60%' }}>
                        <div >
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

export default UserProfile;