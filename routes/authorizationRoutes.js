const express = require("express");
const SpotifyWebApi = require('spotify-web-api-node');

const Router = express.Router();

let state = 'abc123';
const scopes = [
	'ugc-image-upload',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'streaming',
	'app-remote-control',
	'user-read-email',
	'user-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-read-private',
	'playlist-modify-private',
	'user-library-modify',
	'user-library-read',
	'user-top-read',
	'user-read-playback-position',
	'user-read-recently-played',
	'user-follow-read',
	'user-follow-modify'
];

Router.get('/health', (req, res) => {
  res.send('HEALTHY');
});

module.exports = (SpotifyAPI) => {
  Router.get('/login', (req, res) => {
    res.redirect(SpotifyAPI.createAuthorizeURL(scopes));
  });

  Router.get('/refresh', async (req, res) => {
    const { refreshToken } = req.query;
    if(!refreshToken) res.status(400).send('Bad request, refreshToken must be supplied.');
    SpotifyAPI.setRefreshToken(refreshToken);
    try {
      const data = await SpotifyAPI.refreshAccessToken();
      res.json({'accessToken': data.body['access_token'], 'refreshToken': data.body['refresh_token']});
    } catch(error) {
      console.log(`Error: ${error}`);
      res.status(500).send('Error occured refreshing access token.');
    }
  });
  
Router.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  SpotifyAPI
    .authorizationCodeGrant(code)
    .then(async data => {
      //Get tokens from body of response
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      try {
        //Send tokens back in JSON response
        res.json({'accessToken': data.body['access_token'], 'refreshToken': data.body['refresh_token']});
      } catch(error) {
        console.log(`Error: ${error}`);
        res.status(500).send('Error occured sending tokens.');
      }
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
  });

  return Router;
}