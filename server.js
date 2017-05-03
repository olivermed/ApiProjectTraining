var express = require('express');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var app = express();

//MongoClient object
var MongoClient = mongodb.MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/ProjectTrainingDataBase';
app.listen(3000, function (){});

//Connexion to the server
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else { //Début else
        console.log('Connection established to', url);
    }

    app.get('/', function(req, res) {
        res.send('done');
    });
});