import React, {useState} from "react";
import { useNavigate} from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
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
import { addUser } from "../../service/contactDB";
import logo from "./logo.png";
import Modal from "@mui/material/Modal";

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

function SignUp(){
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
    
    const [firstName, setFirstName] = useState('')
    const handleFirstName = (e : any) => {
        setFirstName(e.target.value)
    }
    const [lastName, setLastName] = useState('')
    const handleLastName = (e : any) => {
        setLastName(e.target.value)   
    }
    const [email, setEmail] = useState('')
    const handleEmail = (e : any) => {
        setEmail(e.target.value)
    }
    const [userID, setUserID] = useState('')
    const handleUser = (e : any) => {
        setUserID(e.target.value)
    }
    const [password, setPassword] = useState('')
    const handlePassword = (e : any) => {
        setPassword(e.target.value) 
    }
  const navigate = useNavigate();
  const handleSubmit = async (event: any) => {
    if(firstName !== "" && lastName !== "" && email !== "" && userID !== "" && password !== ""){
    await addUser({firstName, lastName, email, userID, password}).then((response: any) => {
        if(response.status === 201){
        navigate('/')
        }
    });
  }
  else{
    handleOpen()
  }
};

  return (
    <ThemeProvider theme={theme}>
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  value = {firstName}
                  onChange = {handleFirstName}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value = {lastName}
                  onChange = {handleLastName}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value = {email}
                  onChange = {handleEmail}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value = {userID}
                  onChange = {handleUser}
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value = {password}
                  onChange = {handlePassword}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
            <Button
              text-aline="center"
              onClick = {handleSubmit}
              variant="contained"
              sx={{ mt: 4, mb: 4, bgcolor: "black" }}
            > 
              Sign Up
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={s}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Try Again
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    All fields are required !
                  </Typography>
                </Box>
              </Modal>
              
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
              <Link to= "/" >
                {"Already have an account? Sign in"}
              </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;