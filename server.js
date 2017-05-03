var express     = require('express');
var mongodb     = require('mongodb');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var config      = require('./config');
var app         = express();

app.use(bodyParser.urlencoded({extended: true}));

//MongoClient object
var MongoClient = mongodb.MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/ProjectTrainingDataBase';
app.listen(3000, function (){});

app.set('superSecret', config.secret);

//Connexion to the server
MongoClient.connect(url, function (err, db) {

    var User = db.collection('User');

    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else { //Début else
        console.log('Connection established to', url);
    }

    function removeDocument(req, res, Collection) {
        var o_id = new mongodb.ObjectID(req.body.id);
        Collection.find({_id: o_id}).toArray(function(err, obj) {
            Collection.remove({_id: o_id}, function(err, result) {
                console.log('Object ' , req.body , ' deleted from database');
                res.redirect(redirection);
            });

            Files.remove({filename: obj[0].image}, function(err, result) {
                if (err) return console.log(err);
                console.log('Object ' , obj[0].image , ' deleted from database');
            });
        });
    }

    function ModifyDocument(req, res, Collection, redirection) {
        var o_id = new mongodb.ObjectID(req.body.id);
        if (req.file != undefined) {
            req.body.image = req.file.filename;
            uploadSingleImage(req);
        }
        else if (req.files != undefined){
            req.body.image = req.files;
            uploadMultipleImage(req);
        }
        Collection.update({_id: o_id}, {
            $set: req.body,
            $currentDate: { lastModified: true }
        });
        res.redirect(redirection);
    }

    //Db collection getter
    function getCollection(Collection, res) {
        Collection.find().toArray(function (err, results) {
            var collection = {results: results};
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(collection));
        });
    }

    //Db collection saver
    function saveDocument(req, res, Collection) {
        Collection.save(req.body, function (err, result) {
            if (err) return console.log(err);
            var collection = {results: result};
            writeResultJson(res, collection)
            console.log(req.body);
            console.log('saved to database');
        });
    }

    function writeResultJson(res, msg) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(msg));
    }

    app.get('/getUsers', function(req, res) {
        getCollection(User, res);
    });

    app.post('/addUser', function(req, res) {
        saveDocument(req, res, User);
    });

    app.post('/login', function(req, res){
        User.findOne({
            name: req.body.login
        }, function(err, user) {
            if (err) throw err;

                if (!user) {
                  res.json({ success: false, message: 'Authentication failed. User not found.' });
                } else if (user) {

                  // check if password matches
                  if (user.Password != req.body.Password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                  } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, app.get('superSecret'), {
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
