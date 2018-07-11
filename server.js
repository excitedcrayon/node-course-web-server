const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// dynamic port for deploying to Heroku
// so port will be either set to environment or 3000 if the former
// if not found
var port  = process.env.PORT || 3000;
var app = express();
// creating partials for HBS
hbs.registerPartials(__dirname + '/views/partials');
// using hbs | HandleBars for templating
app.set('view engine', 'hbs');

// creating hbs helper(s)
// replaces currentYear : new Date().getCurrentYear();
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('capitalText', (text)  =>{
  return text.toUpperCase();
});

// using the express middleware by calling the use method on app
// __dirname points to the root folder of the project
// app.use(express.static(__dirname + '/public'));
// next parameter is called to ensure the process
// finishes execution before the next line of code is queued
// if not specified |next()| browser will be stuck loading
// one thing to also note is express middlewars are executed
// in the order they are defined
app.use((req,res,next) => {
  var timeNow = new Date().toString();
  var log = `${timeNow}: ${req.method} ${req.url}`;
  console.log(log);
  // write logs to file
  fs.appendFileSync('server.log', log + '\n');
  next();
});

// express middleware that laads the maintance hbs template
// uncomment the next three line is you wish you display maintance page
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

// http route handlers
// takes url and function parameters
app.get('/', (req, res) => {
  // response.send('<h1>Hello World</h1>');
  // response.send({
  //   name: 'Bongani',
  //   likes: [
  //     'Learning New Web Tech',
  //     'Being Alone'
  //   ]
  // });

  // challenge from course
  res.render('home.hbs', {
    pageTitle: 'Home',
    content: 'Here is the welcome page using HBS templating'
  })
});

// create another route
app.get('/about', (req,res) => {
  //res.send('<p>This is the About Page</p>');
  //res.render('about.hbs');
  // you can pass data to the hbs file to make it dynamic
  res.render('about.hbs', {
    pageTitle: 'About',
    content: 'Here you will find secrets about me'
    // currentYear: new Date().getFullYear()
  });
});

// create project route
app.get('/project', (req, res) => {
  res.render('project.hbs',{
    pageTitle: 'Project',
    content: 'I am learning NodeJS and Express'
  });
});

// create another route
app.get('/bad', (req, res) => {
  res.send({
    error: 'Could not fetch the requested data'
  });
});

// common dev port
app.listen(port, () => {
  console.log('Server is running on port 3000');
});
