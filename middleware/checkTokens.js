const express = require("express");

module.exports = (req, res, next) => {
	//Get access sent in request
	const { accessToken, refreshToken } = req.query;
	if(!accessToken) res.status(400).send('Must send auth code with request');
	next();
}