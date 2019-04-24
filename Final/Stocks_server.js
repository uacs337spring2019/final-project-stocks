/*
Aaron Silvers
Nathan Truong

CSC 337, Spring 2019
Final Project

This is the service page for the application known as Stock Checker.
This page uses both node and expressjs.
The service saves data from the user input, whatever stocks that are inputted will
be put in the text file and be put as a button on the b0ottom of the page.
This service gets data from the user and is able to post information back to the page.
*/
const express = require("express");
const app = express();

const fs = require("fs");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));

app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let ticker = req.body.ticker;
	
	
	console.log(ticker);
	
	

	fs.appendFile("PastSearches.txt", ticker + "\r\n" , function(err) {
		if(err) {
			console.log(err);
			res.status(400);
		}
		console.log("The file was saved!");
		res.send("Success!");
	});

	
});

app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let x = "PastSearches.txt";
	let files = fs.readFileSync(x, 'utf8');
	let line = files.split("\n");

	line = [...new Set(line)];
	
	let data = {"tickers":line};
	console.log(data);
	res.send(JSON.stringify(data));
});

app.listen(3000);
