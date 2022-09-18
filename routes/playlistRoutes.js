const { response } = require("express");
const express = require("express");

const Router = express.Router();

module.exports = (SpotifyAPI) => {
	Router.get('/health', (req, res) => {
		res.send('HEALTHY');
	})

	Router.get('/playlist/all', async (req, res) => {
		const {accessToken, refreshToken} = req.query;
		SpotifyAPI.setAccessToken(accessToken);
		SpotifyAPI.setRefreshToken(refreshToken);
		
		try {
			console.log('before');
			console.log('after');
			const user = await SpotifyAPI.getMe();
			console.log('User request', user);

			SpotifyAPI.getUserPlaylists(user.body['display_name'])
			.then(function(data) {
				// console.log('Retrieved playlists', data.body.items);
				res.send(data.body.items);
			},function(err) {
				console.log('getUserPlaylist has failed', err);
				res.status(500).send('Internal server error: /playlist/all');
			});
		} catch(error) {
			console.log(`Error: ${error}`);
			const data = await SpotifyAPI.refreshAccessToken();
			SpotifyAPI.setAccessToken(data.body['access_token']);
			res.status(401).send('Token has expired; Refresh token and try again.');
		}
	})



	return Router;
}