var express     = require('express');
var mongodb     = require('mongodb');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var config      = require('./config');
var dbMF        = require('./DbMainFunction.js');
var app         = express();

app.use(bodyParser.urlencoded({extended: true}));

//MongoClient object
var MongoClient = mongodb.MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/ProjectTrainingDataBase';
app.listen(3000, function (){});

var apiRoutes = express.Router();

app.set('key', config.key);

apiRoutes.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, app.get('key'), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

  apiRoutes.get('/test', function(req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify("ok"));
  });

app.use('/api', apiRoutes);

//Connexion to the server
MongoClient.connect(url, function (err, db) {

  var User = db.collection('User');

  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else { //Début else
    console.log('Connection established to', url);
  }

  apiRoutes.get('/getUser/:id', function(req, res) {
    var o_id = new mongodb.ObjectID(req.params.id);
    dbMF.getOneCollection(req, res, User, o_id);
  });

  app.post('/addUser', function(req, res) {
    dbMF.saveDocument(req, res, User);
  });

  apiRoutes.get('/getUser', function(req, res){
    dbMF.getCollection(User, res);
  });

  //Add friends, update user

  app.post('/login', function(req, res) {
    User.findOne({
      name: req.body.Login
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(400).json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

        // check if password matches
        if (user.Password != req.body.Password) {
          res.status(400).json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, app.get('key'), {
            expiresIn : 60*60*24 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Connected',
            token: token
          });
        }
      }
    });
  });
});
