import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid, TextField } from '@mui/material';
import './postCreation.css'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import LockIcon from '@mui/icons-material/Lock';
import logo from "../../assets/logo.png";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { getAllPosts } from '../../service/contactDB';

const api = axios.create({baseURL: "http://localhost:8080"})

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

function PostCreation() {

    const navigate = useNavigate();
    const { loggedInUser } = useParams();

    let flag: Boolean;

    const [loggedUserData, setLoggedUserData] = React.useState({
        "_id": "",
        "userid": "",
        "firstname": "",
        "lastname": "",
        "email": "",
        "phonenum": "",
        "password": "",
        "display_picture": "",
        "bio": "",
        "posts": [""],
        "followers": [
            "",
            ""
        ],
        "following": [
            "",
            ""
        ],
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


    React.useEffect(() => {
        const fetchData = async () => {
            
            await api.get(`users/${loggedInUser}`).then(res => { 
                setLoggedUserData(res.data.data);
            });
        }

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigatePage = async (item: any) => {
        if (item === "FEED"){
            if(flag){
                const feedForUser = await getAllPosts(loggedInUser).then((data) => {return data})
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
            navigate('/notifications')
        }
        else if(item === "LOGOUT"){
            sessionStorage.removeItem("jwt")
            localStorage.removeItem("userid")
            navigate("/")
    }
    }

    const [imageToAdd, setImageToAdd] = React.useState("");

    const newPost = (e: any) => {
        setImageToAdd(e.currentTarget.src)
    }

    const [visibility, setVisibility] = React.useState(true)

    const handlePublic = () => {
        setVisibility(true)
    }

    const handlePrivate = () => {
        setVisibility(false)
    }

    const [caption, setCaption] = React.useState("Your caption here...")
    const readText = (e: any) => {
        setCaption(e.target.value)
    }

    const handleConfirm = async (e: any) => {
        
        const result = await api.post("/posts", {
            username: loggedUserData.userid,
            caption: caption,
            visible: visibility,
            likes: [],
            comments: [],
            tags: [],
            posting: imageToAdd
        })

        let postList = loggedUserData["posts"]
        postList.push(result.data.postdata.insertedId)

        await api.put(`/users/${loggedInUser}`, {
            postArr: postList
        })

        navigate(`/myprofile/${loggedInUser}`, {state: loggedUserData})
    }
  
    const [images, setImages] = React.useState([]);
    

    const onChange = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
      ) => {

        setImages(imageList as never[]);
      };
  
    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sx={{ paddingBottom: '5%' }}>
                <Box sx={{ display: 'flex'}}>
                    <AppBar component="nav" style={{ background: 'white', opacity: "20"}}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
    
                            </IconButton>
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

            <Grid container justifyContent="center">
                <Grid item xs={8} sx={{ marginTop: '30px', border: 3, borderColor: 'gray', borderRadius: '15px', backgroundColor: '#D3D3D3'}}>
                    <Grid container spacing={0} justifyContent="center">
                        <Grid container spacing={0} justifyContent="center">
                            <Grid item xs={1} sx={{ borderBottom: 3, borderColor: 'gray' }}>
                                <Button startIcon={<CheckIcon/>} onClick = {handleConfirm}/>
                            </Grid>
                            <Grid item xs={10} display="flex" justifyContent="center" alignItems="center" sx={{ borderBottom: 3, borderColor: 'gray' }}>
                                <Typography variant='h6' sx={{ fontWeight: 'bold' }}> Add Post </Typography>
                            </Grid>
                            <Grid item xs={1} display="flex" justifyContent="flex-end" alignItems="flex-end" sx={{ borderBottom: 3, borderColor: 'gray' }}>
                                <Button startIcon={<CloseIcon/>} onClick = {() => navigate(`/myprofile/${loggedInUser}`, {state: loggedUserData})}/>
                            </Grid>
                        </Grid>

                        <Grid item xs={8} display="flex" justifyContent="center" alignItems="center" sx={{ borderRight: 3, borderColor: 'gray' }}>
                            <Grid container spacing={0}>
                                <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant='h6'>Upload a photo or video</Typography>
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                                    <ImageUploading
                                        value={images}
                                        onChange={onChange}
                                    >
                                        {({
                                            imageList,
                                            onImageUpload,
                                        }) => (
                                            <div>
                                                <div style={{display: 'flex', justifyContent:'center'}}>
                                                    <Button 
                                                        variant='contained'
                                                        onClick={onImageUpload}
                                                        style = {{ backgroundColor: '#004C99' }}
                                                    >
                                                        Browse Files
                                                    </Button>
                                                </div>

                                                <div>
                                                    {imageList.map((image, index) => (
                                                        <div key={index} className="image-item" style={{marginTop: '10px'}}>
                                                            <img src={image.dataURL} style={{ border: '3px solid #7F190E', borderRadius: '15px' }} alt="" width="98%" onLoad={newPost}/>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        )}
                                    </ImageUploading>
                                </Grid>

                            </Grid>   
                        </Grid>

                        <Grid item xs={4}>
                            <Grid container spacing={0} justifyContent="center">
                                <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="left">
                                    <Typography variant='h6' align='left' sx={{ pl: 1 }} >Caption</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                <TextField 
                                    variant="standard" multiline rows="10" 
                                    InputProps={{ disableUnderline: true }} 
                                    sx={{ pl: 1, width: '95%'}}
                                    value = {caption}
                                    onChange = {readText}
                                    id="caption" />
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" sx={{ borderTop: 3, borderColor: 'gray' }}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="left">
                                            <Typography variant='h6' align='left' sx={{ pl: 1 }}>Visibility</Typography>
                                        </Grid>
                                        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                                            {visibility ? 
                                                <Button variant="contained" onClick = {handlePublic} sx={{ width: '90%', backgroundColor: '#004C99'}}>
                                                    <LanguageIcon/> &nbsp;Public | Viewable By All Users
                                                </Button> :
                                                <Button variant="outlined" onClick = {handlePublic} sx={{ width: '90%', color: '#004C99'}}>
                                                    <LanguageIcon/> &nbsp;Public | Viewable By All Users
                                                </Button>
                                            }
                                        </Grid>
                                        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                                            {visibility ? 
                                                <Button variant="outlined" onClick = {handlePrivate} sx={{ marginTop: 1, marginBottom: 1, width: '90%', color: '#004C99' }}>
                                                    <LockIcon/> &nbsp;Private | Viewable Only By You
                                                </Button> :
                                                <Button variant="contained" onClick = {handlePrivate} sx={{ marginTop: 1, marginBottom: 1, width: '90%', backgroundColor: '#004C99'}}>
                                                    <LockIcon/> &nbsp;Private | Viewable Only By You
                                                </Button>
                                            }
                                        </Grid>
                                    </Grid>   
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    );
}

export default PostCreation;
