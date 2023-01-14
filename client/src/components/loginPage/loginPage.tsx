import Avatar from "@mui/material/Avatar";
import { useNavigate} from 'react-router-dom';
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {Link} from 'react-router-dom'
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "./logo.png";
import {useState} from "react";
import Modal from "@mui/material/Modal";
import { getAllPosts } from "../../service/contactDB";
// import ActivityFeed from './../activityFeed/activityFeed';

const theme = createTheme();
const s = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const api1 = "http://localhost:8080"

function LoginPage(){
   
  const navigate = useNavigate();

  let feedForUser: any;

  const [userName, setUser] = useState('')
  const handleUser = (e : any) => {
      setUser(e.target.value)
  }
  const [password, setPassword] = useState('')
  const handlePassword = (e : any) => {
      setPassword(e.target.value)
  }
  
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const[connected, setConnected] = useState(sessionStorage.getItem('jwt') !== null)
  const [open3, setOpen3] = useState(false)
  const date = new Date()
  const handleOpen1 = () => setOpen1(true)
  const handleClose1 = () => setOpen1(false)
  const handleOpen2 = () => setOpen2(true)
  const handleClose2 = () => setOpen2(false)
  const handleClose3 = () => setOpen3(false)

  const handleSubmit = async () => {

    let tempStorageContents = window.localStorage.getItem(userName)
    let storageContents = JSON.parse(tempStorageContents ? tempStorageContents : '{"attempts": null,"disabled": null}')

    const userToFind = await fetch(`${api1}/login/${userName}/${password}`).then(res => {return res.json()});
      
    if(userToFind.data.first === 2 && (storageContents.disabled === null || (date.getTime()-storageContents.disabled)/(1000*60) > 1)){
      localStorage.setItem("userid", userToFind.data.second["_id"])
      window.localStorage.removeItem(userName)
      if(userToFind["token"]){
        sessionStorage.setItem("jwt",  userToFind["token"])
        setConnected(true)
        connection()
      } else {
        setConnected(false)
      }
      // const feedForUser = await getAllPosts(userToFind.data.second["_id"]).then((data) => {return data})
      // navigate(`/feed/${userToFind.data.second["_id"]}`, {state: {feedForUser}})
    }
    else if(userToFind.data.first === 2){
      storageContents.attempts = storageContents.attempts + 1
      storageContents.disabled = date.getTime()
      window.localStorage.setItem(userName, JSON.stringify(storageContents))
      setOpen3(true)
    }
    else if(userToFind.data.first === 1){
      if(storageContents.attempts === null) {
        const newStorageContents = {
          attempts: 1,
          disabled: null
        }
        window.localStorage.setItem(userName, JSON.stringify(newStorageContents))
        handleOpen1()
      } else {
        storageContents.attempts = storageContents.attempts + 1
        
        if(storageContents.attempts > 3) {
          setOpen3(true)
          storageContents.disabled = date.getTime()
        } else {
          handleOpen1()
        }

        window.localStorage.setItem(userName, JSON.stringify(storageContents))
      } 
      
    }
      else if(userToFind.data.first === 1){
        handleOpen1()
      }
    else{
      handleOpen2()
    }
  };

  const connection = async() => {
    feedForUser = await getAllPosts(localStorage.getItem("userid")).then((data) => {return data})
    if(feedForUser.error){
      sessionStorage.removeItem("jwt")
      localStorage.removeItem("userid")
      navigate(`/`)
    } else {
      navigate(`/feed/${localStorage.getItem("userid")}`, {state: {feedForUser}})
    }
   
  }

  setTimeout(() => {
    if(connected){
      connection()
    }
  }, 500)

  return (
    <div> 
      { !connected? <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <img src={logo} alt="logo" height="60" />

          <Avatar sx={{ mt: 4, mb: 2, bgcolor: "black" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1, border: 0, borderRadius: "16px" }}
          >
            <TextField
              margin="normal"
              required
              onChange = {handleUser}
              fullWidth
              id="userName"
              label="Username"
              name="userName"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              onChange = {handlePassword}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
          <Grid container justifyContent="center">
            <Button
              name="signin"
              text-aline="center"
              onClick={handleSubmit}
              variant="contained"
              sx={{ mt: 4, mb: 4, bgcolor: "black" }}
            >
              Sign In
            </Button>
            <Modal
                open={open1}
                onClose={handleClose1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={s}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Try Again
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    The password you entered in incorrect!
                  </Typography>
                </Box>
              </Modal>
              <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={s}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Try Again
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    The username you entered in incorrect!
                  </Typography>
                </Box>
              </Modal>
              <Modal
                open={open3}
                onClose={handleClose3}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={s}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Account Disabled for 1 minute
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Too many failed login attempts
                  </Typography>
                </Box>
              </Modal>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Link to= "/forgotPassword" >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to= "/signUp" >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider> :
    <div>You're already logged in!
    </div> }
    </div>
  );
}

export default LoginPage;

