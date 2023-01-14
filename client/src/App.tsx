import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import LoginPage from './components/loginPage/loginPage';
import SignUp from './components/signUp/signUp';
import ActivityFeed from './components/activityFeed/activityFeed';
import ForgotPassword from './components/forgotPassword/forgotPassword';
import OtherUserProfile from './components/otherUserProfile/otherUserProfile';
import PostCreation from './components/postCreation/postCreation';
import UserProfile from './components/userProfile/userProfile';


function App() {

  return (
    <Router>
      <div className="App">
      </div>
      <Routes> 
        <Route path="/myprofile/:loggedInUser/*" element = {<UserProfile />} />
        <Route path="/otherprofile/:loggedInUser/:otherUser/*" element = {<OtherUserProfile />} />
        <Route path="/feed/:loggedInUser/*" element = {<ActivityFeed/>} />
        <Route path="/addpost/:loggedInUser/*" element = {<PostCreation />} />
        <Route path="/forgotPassword" element = {<ForgotPassword/>} />
        <Route path="/signUp" element = {<SignUp/>} />
        <Route path="" element = {<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
