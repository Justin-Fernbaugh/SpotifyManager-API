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
  //
  Router.get('/login', (req, res) => {
    res.redirect(SpotifyAPI.createAuthorizeURL(scopes));
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
      // console.log("body of request", data.body['expires_in']);
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      SpotifyAPI.setAccessToken(access_token);
      SpotifyAPI.setRefreshToken(refresh_token);

      // console.log('access_token:', access_token);
      // console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );

      const accessToken = encodeURIComponent(data.body['access_token']);
      const refreshToken = encodeURIComponent(data.body['refresh_token']);
      res.redirect(`/?accessToken=${accessToken}&refreshToken=${refreshToken}`);

      setInterval(async () => {
        const data = await SpotifyAPI.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        SpotifyAPI.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
  });

  return Router;
}