import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
const axios = require('axios');

class App extends Component{
  constructor(props){
    super(props);
    this.state = {display_name : "", profile_pic : 'https://synctrack.live/favicon.ico'}
  }
  render(){
    return(
      <div>
      <nav>
      <img src={this.state.profile_pic}/>
      <p>{this.state.display_name}</p>
      </nav>
      <div className='content'>
      <h1>your top artists</h1>
      <div className='cards' id='top-artists'>
      
      </div>
      <h1>your top tracks</h1>
      <div className='cards' id='top-tracks'>
      </div>

      </div>
      </div>
      )
  }
  componentDidMount(){
    const hash = window.location.hash
          .substring(1)
          .split("&")
          .reduce(function(initial, item) {
            if (item) {
              var parts = item.split("=");
              initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
          }, {});



    window.location.hash = '';
    // Set token


    let _token = hash.access_token;

    


    const authEndpoint = 'https://accounts.spotify.com/authorize';

    // Replace with your app's client ID, redirect URI and desired scopes
    const clientId = '3be56587b1674ecba36c995b7cdbdd03';
    const redirectUri = "http://localhost:3000/";
    // const redirectUri = "http://localhost:3000/";


    let content = document.querySelector(".content");


    if (!_token) {
      let url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=` + encodeURIComponent('user-follow-modify playlist-modify-public playlist-modify-private user-follow-read playlist-read-private user-top-read user-library-modify user-read-currently-playing user-read-playback-state user-read-private user-read-recently-played user-read-email user-read-private user-modify-playback-state');
      content.innerHTML = `
<a class='connect-button' href='${url}'>Connect</a>
      `
    }


    
    // establish which user
    axios.get('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + _token}
    })
    .then((response)=>{
      let data = response.data;
      let profile_pic = 'https://synctrack.live/favicon.ico'

      try{
        profile_pic = data.images[0].url
      }
      catch{
        console.log("no image found.")
      }
      
      this.setState({display_name : data.display_name, profile_pic : profile_pic, username : data.id})
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      
    });

    





    this.setState({
      token : _token
    },()=>{
      this.get_top_artists();
      this.get_top_tracks();
    })
  }

  get_top_artists(){
    let cards = document.querySelector("#top-artists");
    axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {'Authorization': 'Bearer ' + this.state.token}
    })
    .then((response)=>{
      let artists = response.data.items;

      artists.forEach((el, i)=>{
        cards.innerHTML += `
<div class='card'>
<div class='image-container'>
<img src='${el.images[0].url}'/>
</div>
<p class='main-text'>${i+1}. ${el.name}</p>
<p class='sub-text'></p>
        `
      })
      document.querySelector("nav").style.width = '2100px'

      console.log(document.querySelector("nav").style.width)

    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      
    });

  }
  get_top_tracks(){
    let cards = document.querySelector("#top-tracks");
    axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {'Authorization': 'Bearer ' + this.state.token}
    })
    .then((response)=>{
      let artists = response.data.items;

      artists.forEach((el, i)=>{
        cards.innerHTML += `
<div class='card'>
<div class='image-container'>
<img src='${el.album.images[0].url}'/>
</div>
<p class='main-text'>${i+1}. ${el.name}</p>
<p class='sub-text'></p>
        `
      })
      document.querySelector("nav").style.width = '2100px'

      console.log(document.querySelector("nav").style.width)

    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      
    });

  }
}

export default App;
