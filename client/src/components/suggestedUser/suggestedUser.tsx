import { Avatar, Button,} from "@mui/material";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search"
import IconButton from '@mui/material/IconButton';
import {useNavigate} from 'react-router-dom';
import './suggestedUser.css'
import axios from "axios"

const api = axios.create({baseURL: "http://localhost:8080"})

api.interceptors.request.use(config => {
    if(config && config.headers){
        config.headers['Authorization'] =`${sessionStorage.getItem('jwt')}`;
    }

    return config;
    
});

function SuggestedUser({loggedInUser} : any) {
    const filterData = (query : string, d : any) => {
        return d
    };
    
    const [suggested, setSuggested] = useState([
        "Loading Suggested Users",
    ]); 

  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, suggested);
  let followingArrForLogged = ["Loading Suggested Users"];
  let followersArrForUser = ["Loading Suggested Users"];
    React.useEffect(() => {
        
        const fetchData = async () => {
            let newSuggested = ["Loading Suggested Users"]
            await api.get(`/suggested/${loggedInUser}`).then((res) => {
                console.log("res from /suggested: ", res)
                if(res.data.data.length === 0) {
                    console.log("Not getting anyone")
                        api.get('/users').then(res =>{ 
                            let nlen = res.data.data.length
                            for (var i = 0; i < nlen; i = i + 1) {
                                if (res.data.data[i]["_id"] === loggedInUser){
                                    for(var j = 0; j < nlen; j = j + 1){
                                        if((res.data.data[i].following.indexOf(res.data.data[j].userid) === -1) && (res.data.data[i]["_id"] !== res.data.data[j]["_id"])){
                                            newSuggested.push(res.data.data[j].firstname + " " + res.data.data[j].lastname)
                                            }
                                    }
                                }
                                setSuggested(newSuggested.slice(1)) 
                            }   
                        });
                }
                else {
                    console.log("Getting someone ", res.data.data)
                    setSuggested(res.data.data)
                }

            })


        };
        fetchData()
        // eslint-disable-next-line
    }, []);
    const SearchBar = ({setSearchQuery} : any) => (
        <form style={{
            marginTop: "27%"
        }}>
        <TextField
            id="search-bar"
            className="text"
            onInput={() => {
            // setSearchQuery();
            }}
            style={{
                width: "250px",
            }}
            label="Search a user"
            variant="outlined"
            size="small"
        />
        <IconButton type="submit" aria-label="search">
            <SearchIcon style={{ fill: "#171F57" }} />
        </IconButton>
        </form>
    );
    const navigate = useNavigate();
    let flag: Boolean;

    if(sessionStorage.getItem("jwt") !== null){
        flag =  true
    }
    const getUser = async (user : string) => {
    
        await api.get('/users').then(res => {
          for (var i = 0; i < res.data.data.length; i = i + 1) {
              var str = res.data.data[i].firstname + " " + res.data.data[i].lastname

              if(flag){
                if (str === user){
                    if(res.data.data.error){
                        sessionStorage.removeItem("jwt")
                        localStorage.removeItem("userid")
                        navigate(`/`)
                    } else {
                        navigate(`/otherprofile/${loggedInUser}/${res.data.data[i]["userid"]}`)
                    }
                  }
              }else {
                navigate("/")
              }
          }  
        });
      }
      let other = ""
      const [followValue, setFollowValue] = React.useState('Follow');
      const changeFollow = async(user : string) => {
        if (followValue === "Follow") {
    
        await api.get('/users').then(res => {
            let imp = res.data.data.findIndex((obj: { _id: string; }) => obj._id === loggedInUser)
            for ( let i = 0 ; i < res.data.data.length; i = i + 1) {
                var str = res.data.data[i].firstname + " " + res.data.data[i].lastname
                if (str === user){
                    followersArrForUser = res.data.data[i].followers
                    followingArrForLogged = res.data.data[imp].following
                    followingArrForLogged.push(res.data.data[i].userid)
                    followersArrForUser.push(res.data.data[imp].userid)
                    other = res.data.data[i].userid
                    break
                }
            }
        });     
            
                await api.put(`/usering/${loggedInUser}`, {
                    following: followingArrForLogged
                })
            
                await api.put(`/userings/${other}`, {
                    followers: followersArrForUser
                })
                navigate(`/otherprofile/${loggedInUser}/${other}`)
               
          setFollowValue("Unfollow");
          
    }}
  return (
    <div>
                <SearchBar setSearchQuery={setSearchQuery}/>
                <div className='suggestedUser'>
                    <div className='line'></div>
                    <div style={{
                        paddingTop: "10px",
                        fontSize: 20,
                        textAlign: "center",
                        color: "#7F190E",
                        fontWeight: "bold"
                    }}>Suggested Users</div>
                    <div className='userBlock'>
                        {dataFiltered.map((d : any) => (
                            <div className='user' key={d}>
                                <><Avatar
                                className="post__avatar"
                                src="/static/images/avatar/1.jpg"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    display: "inline-flex"
                                }} /><span
                                    className="text" id="user" style={{
                                        cursor: "pointer",
                                        justifyContent: "normal",
                                        fontSize: 18,
                                        color: "#7F190E",
                                        margin: 1,
                                        width: "200px",
                                        borderWidth: "10px"
                                    }}
                                    key={d.id}
                                    onClick={(e) => getUser(d)}>
                                    {d}
                                    </span>
                                <Button key={d.id} style={{ color: '#004C99' }}onClick={(e) => changeFollow(d)}>{followValue}</Button>
                                </>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
  );
}

export default SuggestedUser;
