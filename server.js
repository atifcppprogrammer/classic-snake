/**
 * Script defines the server module.
 *
 * @author atifcppprogrammer.
 */

const messages = require('./modules/helpers.js').messages;
// Importing all programmer defined modules.
const scores = require('./modules/scores.js');

 // Importing all required node modules.
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

// Defining port on which the server will listen for requests.
const port = process.env.PORT || 8080;
const app = express();

// Setting up middle-ware for parsing json present in
// client requests.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Setting up middle-ware for serving static files to
// the client.
app.use(express.static(path.join(__dirname,'client')));

// Matching api calls to methods serving json responses.
app.post('/api/v1/submit.json',scores.submitScore);
app.get('/api/v1/scores.json',scores.getScores);

// Ensuring that root url routes to /contents/home.html.
app.get('/',(req,res)=>{
    res.redirect('/contents/html/home.html');
});

// Ensuring that one of these four pages are served by server
// and all others are routed to 404.html
const pages = new Set(['home','play','scores','credits']);
app.get('/:page',(req,res)=>{
    const url = '/contents/html/PAGE.html';
    const page = req.params.page;
    // redirecting.
    const last = url.replace('PAGE',pages.has(page)?page:'404');
    res.redirect(last);
});

// For invalid urls.
app.get('*',(req,res)=>{
    res.redirect('/contents/html/404.html');
});

// Starting listening once connection estalishing otherwise
// throwing error.
scores.connection.then(()=>{
    console.log(messages.onMongoConnectSuccess);
    app.listen(port);
},()=>{
    console.log(messages.onMongoConnectFailure);
});


