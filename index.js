require('dotenv').config()
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const authorizationRoutes = require('./routes/authorizationRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

const SpotifyAPI = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	redirectUri: process.env.REDIRECT_URL,
});

app.use('/', authorizationRoutes(SpotifyAPI));
app.use('/api', playlistRoutes(SpotifyAPI));

app.listen(PORT, () => {
	console.log(`Listening at ${PORT}`);
})
