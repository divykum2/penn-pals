import { Avatar, Box, Button, Modal } from "@mui/material";
import { BsHeart, BsHeartFill, BsTrash, BsPencil } from 'react-icons/bs';
import { BiComment } from 'react-icons/bi';
import { Routes, Route, useNavigate} from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import './post.css';
import React from "react";
import OtherUserProfile from "../otherUserProfile/otherUserProfile";
import axios from "axios"
import { Mention, MentionsInput, SuggestionDataItem} from 'react-mentions'
import { getAllUsers, getUser } from "../../service/contactDB";

// const setHeaders =() =>{
//   axios.defaults.headers.common['Authorization'] = (sessionStorage.getItem('jwt') !== null) ? sessionStorage.getItem('jwt') : null;
// }

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    Authorization: `${sessionStorage.getItem('jwt')}`
  }
});

function Post({loggedInUser, postData} : any) {

  const navigate = useNavigate();

  const [like, setLike] = React.useState(true);
  let flag: Boolean;


  let users = React.useRef<SuggestionDataItem[]>([])
  let comRef = React.useRef<Object[]>([
    {
      "id": '',
      "commentid" : "",
      "comment": ''
    }
  ])
  const [comment, setComment] = React.useState('');
  const [editFlag, setEditFlag] = React.useState(false);
  const editComment = React.useRef<Object>(
    {
      "id": '',
      "commentid" : "",
      "comment": ''
    }
  );
  let userData: any;

  if(sessionStorage.getItem("jwt") !== null){
    flag =  true

  }

  React.useEffect(() => {
    
    setLike(postData.likes.indexOf(loggedInUser) > -1)
    let result: any[] = []
    let comms = []
    const fetchData = async () => {
        await getAllUsers().then(res => { 
          
          result = res;
        });


        // eslint-disable-next-line react-hooks/exhaustive-deps
        userData = await getUser(loggedInUser).then(res => {return res});

        users.current = (result.map((res) => ({
            id: res.userid,
            display: `${res.firstname} ${res.lastname}`
        })))

        let postID = postData["_id"]

        const response = await api.get(`/posts/${postID}`).then((res:any) => {return res.data})

        if(response && response.data[0]){
          comms = response.data[0].comments
          comRef.current = comms
        }

    };

    fetchData();
  });

  const setValue = (value: string) => {
      setComment(value)
    }

  const setComments = async() => {

    const unique_id = uuid();
    const regex = /\[(.*)\]/
    const op = comment.match(regex)
    if(op){
        let clean = comment.replace(op[0], '')
        clean = `${userData.data["firstname"]}:  ` + clean
        let comList = comRef.current
        comList.push({"id" : loggedInUser, "commentid" : unique_id, "comment": clean})
        comRef.current = comList 
    } else {
      let clean = `${userData.data["firstname"]}`
      clean = clean + ": " + comment
      let comList = comRef.current
      comList.push({"id" : loggedInUser, "commentid" : unique_id, "comment": clean})
      comRef.current = comList 
    }
    
    let comments_value = comRef.current
    const response = await api.put(`/getFeed/comment/${postData["_id"]}`, {
      comments: comments_value
    })
    console.log("comments response", response)
    setComment('')
  }


  const navToUser = () => {
    if (postData.userid === loggedInUser) {
      if(flag)
        navigate(`/myprofile/${loggedInUser}`)
      else 
        navigate('/')
    } else {
      if(flag)
        navigate(`/otherprofile/${loggedInUser}/${postData["username"]}`)
      else 
        navigate('/')
    }
  }

  const changeLike = async () => {
    let user_likes = postData.likes

    if(like === false){
      setLike(true);
      <BsHeartFill style={{
        marginLeft : '27%',
        position: 'absolute'
      }}></BsHeartFill>

      user_likes.push(loggedInUser)
      

      await api.put(`/posts/${postData["_id"]}`, {
        likes: user_likes
      }) 

    } else {
      setLike(false);
      <BsHeart style={{
        marginLeft : '27%',
        position: 'absolute'
      }}></BsHeart>

      user_likes.splice(user_likes.indexOf(loggedInUser), 1)

      await api.put(`/posts/${postData["_id"]}`, {
        likes: user_likes
      }) 

    }
  }

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setEdit = async(res: any) => {

    let regex = '^[^:]+:*'
    const op = res['comment'].match(regex)    
    let clean = res['comment'].replace(op[0], '')
    setComment(clean)
    setEditFlag(true);
    editComment.current = res
  }

  const handleEdit = async() => {
    console.log("printing the comment to be edited deleted", comRef.current, editComment) 
    let coms:any = []
    let edit:any = editComment.current
    comRef.current.map((r:any) => {
      if(r["commentid"] !== edit["commentid"]){
        coms.push(r)
      }
      return ''
    })
    comRef.current = coms
    const response = await api.put(`/getFeed/comment/${postData["_id"]}`, {
      comments: coms
    })

    setComment('')
    console.log("comments response", response)

    setComments()
  }

  const handleDelete = async(res: any) => {
    console.log("printing the comment to be deleted", comRef.current, res) 
    let coms:any = []
    comRef.current.map((r:any) => {
      if(r["commentid"] !== res["commentid"]){
        coms.push(r)
      }
      return ''
    })
    comRef.current = coms
    const response = await api.put(`/getFeed/comment/${postData["_id"]}`, {
      comments: coms
    })

    setComment('')
    console.log("comments response", response)
    handleClose()

  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60vw",
    height: "50vh",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <div className="post">
      <div className="post__header">
        <h3 style={{ cursor: "pointer" }} onClick={(e) => navToUser()}>{postData.username}</h3>
        <span id="comment" style={{position: 'absolute', left: '47%'}}>
          <BiComment  size="22px" aria-label="comment" style={{cursor: "pointer"}} onClick={handleOpen}>
          </BiComment>
        </span>
        <span style={{position: 'absolute', left: '50%'}}>
          {like?
          <BsHeartFill size="20px" aria-label="heartFill" style={{
            cursor: "pointer"
          }} onClick={() => {changeLike()}}></BsHeartFill> : 
          <BsHeart  size="20px" style={{
            cursor: "pointer"
          }} onClick={() => {changeLike()}}></BsHeart>}
        </span>
        <Modal
          hideBackdrop
          open={open}
          onClose={handleClose}
          data-testid="modal-input"
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: "50vw" }}>
          <div>
            <Button className="closeButton" onClick={handleClose}>&times;</Button>
            <h2 id="child-modal-title">Comments</h2>
          </div>
          <div id="child-modal-description">
                <div className="content">
                {comRef.current.map((res:any) => (
                    <div style={{
                        marginLeft: "10px"
                    }}><Avatar
                                className="post__avatar"
                                src="/static/images/avatar/1.jpg"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    display: "inline-flex",
                                    marginBottom: "5px"
                    }}/>{res["comment"]}{res["id"] === loggedInUser?
                    <><BsPencil style={{
                        paddingLeft: "60px",
                        cursor: "pointer"
                    }} onClick={() => setEdit(res)}></BsPencil><BsTrash style={{
                        paddingLeft: "10px",
                        cursor: "pointer"
                      }} onClick={() => handleDelete(res)}></BsTrash></>:null}</div>
                ))}
                <br></br>
                </div>
                <div className='commentInput'>
                    <MentionsInput 
                        style={{
                            display:"inline-block",
                            width: '50%',
                            marginLeft: "8%"
                        }}
                        className='mentionInput'
                        placeholder='Comment here'
                        value={comment}
                        onChange={(e) => setValue(e.target.value)}>
                        <Mention data={users.current} trigger={'@'} />
                    </MentionsInput>
                    <Button 
                    style={{
                        display:"inline-block"
                    }}
                    onClick={()=>{if(editFlag){handleEdit()}else{setComments()}}}>Comment</Button>
                </div>
          </div>
        </Box>
        </Modal>
        
      </div>
      {/* Image */}
      <img className="post__image" src={postData.posting} alt="post" />

      <h4 className="post__text">
        <strong style={{ cursor: "pointer" }} onClick={(e) => navToUser()}>{postData.username}</strong> {postData.caption}
      </h4>    
      <Routes>
        <Route path={`/users/${postData.userid}`} element={<OtherUserProfile />} />
      </Routes>
    </div>
    
  );
}

export default Post;