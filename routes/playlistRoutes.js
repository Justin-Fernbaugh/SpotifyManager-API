const express = require("express");
const SpotifyWebApi = require('spotify-web-api-node');

const Router = express.Router();

module.exports = (SpotifyWebApi) => {
	Router.get('/health', (req, res) => {
		res.send('HEALTHY');
	})
	return Router;
}