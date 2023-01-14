import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Popover from '@mui/material/Popover';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../../assets/logo.png";


const theme = createTheme();

const ForgotPassword = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const [anchor, setAnchor] = React.useState(null);
  const openPopover = (event: { currentTarget: any; }) => {
    setAnchor(event.currentTarget);
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
            Password Recovery
          </Typography>
          <Box 
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, border: 0, borderRadius: "16px", width:"400px" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address or Username"
              name="emailOrUsername"
              autoComplete="email"
              autoFocus
            />
           
          <Grid container justifyContent="center">
            <Button
              text-aline="center"
              type="submit"
              variant="contained"
              onClick={openPopover}
              sx={{ mt: 4, mb: 4, bgcolor: "black" }}
            >
              Submit
            </Button>
          
            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
            <Typography sx={{ p: 2 }}>Your request has been submitted. Kindly wait for us to get back to you. </Typography>
            </Popover>
            </Grid>
            
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ForgotPassword;