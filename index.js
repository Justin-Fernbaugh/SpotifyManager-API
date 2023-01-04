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

app.use(express.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
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
