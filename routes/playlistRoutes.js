const { response } = require("express");
const express = require("express");

const Router = express.Router();

module.exports = (SpotifyAPI) => {
	Router.get('/health', (req, res) => {
		res.send('HEALTHY');
	})

	Router.get('/playlist/all', async (req, res) => {
		const {accessToken, refreshToken} = req.query;
		if(!accessToken) {
			console.log("No access or refresh token passed.");
			// console.log(`AccessToken: ${accesstoken} \n refreshToken: ${refreshToken}`);
			return;
		}
		SpotifyAPI.setAccessToken(accessToken);
		
		try {
			const user = await SpotifyAPI.getMe();

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
			res.status(401).send('Token has expired; Refresh token and try again.');
		}
	})

	Router.post('/playlist/', (req, res) => {
		const { accessToken, refreshToken } = req.query;
		SpotifyAPI.setAccessToken(accessToken);
		const { playlist, tracks } = req.body;

		try {
			const song = SpotifyAPI.addTracksToPlaylist(playlist, tracks)
			console.log('Added tracks ', tracks, " to ", playlist);
			res.send(song);
		} catch(error) {
			console.log(`Error: ${error}`);
			res.status(401).send('Token has expired; Refresh token and try again.');
		}
	})



	return Router;
}