import * as React from 'react';
import { DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import "./profilePost.css";
import axios from "axios"
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const api = axios.create({baseURL: "http://localhost:8080"});

api.interceptors.request.use(config => {
  if(config && config.headers){
      config.headers['Authorization'] =`${sessionStorage.getItem('jwt')}`;
  }

  return config;
  
});

function ProfilePost({postid, postOfUser} : any) {
    const [userPost, setUserPost] = React.useState({
        "username": "",
        "posting": "",
        "caption": "",
        "visible": true,
        "likes": [],
        "comments": [],
        "tags": [],
        "_id": ""
    })

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    const [open1, setOpen1] = React.useState(false);

    const handleClickOpen1 = () => {
        setOpen1(true);
    };

    const handleClose1 = () => {
        setOpen1(false);
    };

    const [captions, setCaption] = React.useState('')
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    
    const [deleted, setDeleted] = React.useState(false);

    const handleDelete = async () => {

        
        await api.delete(`posts/${postid}`)
        await api.delete(`users/${userPost.username}/${postid}`)
        handleClose()
        setDeleted(true)
    };
    
    const handleEdit = async (e : any) => {
        setCaption(e.target.value)
    }

    const handleEditSubmit = async () =>{
        await api.put(`posting/${postid}`, {
            caption: captions
        })
        handleClose1()
        window.location.reload();
    };
    
    React.useEffect(() => {
        if(postid) {
            const fetchData = async () => {
                
                await api.get(`posts/${postid}`).then(res => {
                    setUserPost(res.data.data[0])
                })
            }
            fetchData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(userPost !== undefined && !deleted && (postOfUser || userPost.visible)) {
    return (
        <div className="profile__post">
            { postOfUser ?
                <div className="profile__post__header" style={{ marginBottom:"10px", marginTop:"10px" }}>
                    <AiFillDelete size= "20px" aria-label="delete" style={{
                    position: 'absolute',
                    cursor: "pointer"
                    }}
                        onClick = {handleClickOpen}
                    ></AiFillDelete>

                    <BootstrapDialog
                        onClose={handleClose}
                        open={open}>

                        <DialogContent dividers>
                            <Typography gutterBottom>
                                Are you sure you want to delete this post?
                            </Typography>
                        </DialogContent>

                        <DialogActions style={{alignSelf: 'center'}}>
                            <Button onClick={handleDelete}>
                                Delete Post
                            </Button>
                            <Button onClick={handleClose}>
                                Keep Post
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>

                    <AiFillEdit size= "20px" aria-label="edit" style={{
                        position: 'absolute',
                        cursor: "pointer",
                        marginLeft: "40px"
                    }}
                    onClick={handleClickOpen1}
                    ></AiFillEdit>

                    <Dialog fullWidth={true} open={open1} onClose={handleClose1}>
                        <DialogTitle>Update caption</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Write your new caption below
                            </DialogContentText>
                            <TextField
                                margin="dense"
                                id="name"
                                fullWidth
                                variant="standard"
                                onChange = {handleEdit}
                            />
                        </DialogContent>
                        <DialogActions style={{alignSelf: 'center'}} >
                            <Button onClick={handleClose1}>Cancel</Button>
                            <Button onClick={handleEditSubmit}>Post</Button>
                        </DialogActions>
                    </Dialog>

                    {userPost.visible ? <VisibilityIcon sx={{position: 'absolute', left: '61%', color: '#606060'}}></VisibilityIcon> : 
                                        <VisibilityOff sx={{position: 'absolute', left: '61%', color: '#606060'}}></VisibilityOff>}

                </div> : <div> </div> }
                <div>
                    <img className="profile__post__image" src={userPost.posting} alt="post" />
                </div>
                <div className="profile__post__text">
                    <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>{userPost.caption}</Typography>
                </div>
            </div>
    );
    } else {
        return( <div> </div>)
    }
}

export default ProfilePost;
