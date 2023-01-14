import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Grid } from '@mui/material';
import Post from '../post/post';
import './activityFeed.css'
import logo from "../../assets/logo.png";
import SuggestedUser from '../suggestedUser/suggestedUser';
import { useLocation } from 'react-router-dom';
import { getUser } from "../../service/contactDB";
import InfiniteScroll from "react-infinite-scroll-component";
// import axios from "axios";
import { getAllPosts } from "../../service/contactDB";

// const api = axios.create({baseURL: "http://localhost:8080"})


function ActivityFeed() {

    const navigate = useNavigate();
    const location = useLocation();
    let flag: Boolean = false;

    const { loggedInUser } = useParams();

    const navItems = ["Notifications", "Profile", "Logout"]

    const navigatePage = async (item: any) => {

        if(sessionStorage.getItem("jwt") !== null){
            flag =  true
        } else {
            navigate("/")
        }

        if (item === "PROFILE"){
            if(flag){
                const result = await getUser(loggedInUser).then((res:any) => {return res.data})
                if(result.error){
                    sessionStorage.removeItem("jwt")
                    localStorage.removeItem("userid")
                    navigate(`/`)
                } else {
                    navigate(`/myprofile/${loggedInUser}`, {state: result})
                }
                
            } else {
                navigate(`/`)
            }
        }
        else if(item === "LOGOUT"){
            sessionStorage.removeItem("jwt")
            localStorage.removeItem("userid")
            navigate("/")
        }
    }

    let userPosts = location.state.feedForUser.map((post:any) => (
        <Post
            loggedInUser={loggedInUser}
            postData={post} />
        ))

    const photoCounter = React.useRef(userPosts.length < 5 ? userPosts.length : 5)
    const [displayedFeed, setDsiplayedFeed] = React.useState(userPosts.slice(0, photoCounter.current))
    let morePosts = React.useRef(true)
    const fetchMoreData = async (callFrom: any) => {

        if(sessionStorage.getItem("jwt") === "null" || sessionStorage.getItem("jwt") == null){
            navigate("/")
        } else {
            if(callFrom === "timer" && photoCounter.current !== userPosts.length) {
                return
            }
    
            const totalPosts = await getAllPosts(loggedInUser).then((data) => {return data})
    
            if(totalPosts.length !== userPosts.length) {
                userPosts = totalPosts.map((post:any) => (
                    <Post
                        loggedInUser={loggedInUser}
                        postData={post} />
                    ))
            }
    
            if (photoCounter.current <= userPosts.length-5) {
                let currentFeed = displayedFeed
                currentFeed = currentFeed.concat(userPosts.slice(photoCounter.current, photoCounter.current+5))
                setDsiplayedFeed(currentFeed)
                photoCounter.current = photoCounter.current + 5
            }
            else if (photoCounter.current < userPosts.length) {
                let currentFeed = displayedFeed
                currentFeed = currentFeed.concat(userPosts.slice(photoCounter.current))
                setDsiplayedFeed(currentFeed)
                photoCounter.current = userPosts.length
                morePosts.current = false
            }
            else if (photoCounter.current > userPosts.length) {
                setDsiplayedFeed(userPosts)
                photoCounter.current = userPosts.length
                morePosts.current = false
            }
            else {
                morePosts.current = false
            }
        }
        
    }

    setInterval(() => { fetchMoreData("timer") }, 10000)

    return (
        <Grid container spacing={2} justifyContent="center">
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
                                    <Button key={item} onClick={(item) => navigatePage(item.currentTarget.innerText)} sx={{ color: '#7F190E' }}>
                                        {item}
                                    </Button>
                                ))}
                            </Box>
                        </Toolbar>
                    </AppBar>
                </Box>
            </Grid>
            <Grid item xs={5} style={{
                marginTop: '5%'
            }}>
                <InfiniteScroll
                dataLength={displayedFeed.length}
                next={() => {fetchMoreData("scroll")}}
                hasMore={true}
                loader={morePosts.current ? <h4>Loading more posts</h4> : <h4>No more posts to display</h4>}
                >
                    <div className = "timeline">
                        {displayedFeed}
                    </div>
                </InfiniteScroll>
            </Grid>
            
            <Grid item xs={3}>
                {<SuggestedUser loggedInUser={loggedInUser}/>}
                </Grid>
        </Grid>
        
    );
}

export default ActivityFeed;