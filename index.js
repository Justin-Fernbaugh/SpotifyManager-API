require('dotenv').config()
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const checkTokens = require('./middleware/checkTokens');
const authorizationRoutes = require('./routes/authorizationRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

const SpotifyAPI = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	redirectUri: process.env.REDIRECT_URL,
});
try {
	app.use('/', authorizationRoutes(SpotifyAPI));
	app.use('/api', checkTokens, playlistRoutes(SpotifyAPI));
} catch(err) {
	console.log(`ERROR: ${err}`);
}

app.get('/', (req, res) => {
	const { accessToken, refreshToken } = req.query;
	// console.log(accessToken + "refresh" + refreshToken);
	if(accessToken && refreshToken){
		res.send(`Welcome to the backend accessToken: ${accessToken} refreshToken: ${refreshToken}`);
	}

	res.send('Welcome to the backend');
})

app.listen(PORT, () => {
	console.log(`Listening at ${PORT}`);
})
