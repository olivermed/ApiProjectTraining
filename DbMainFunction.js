function writeResultJson(res, msg) {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(JSON.stringify(msg));
}

exports.removeDocument = function(req, res, Collection) {
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
};

exports.ModifyDocument = function(req, res, Collection, redirection) {
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
};

//Db collection getter
exports.getCollection = function(Collection, res) {
  Collection.find().toArray(function (err, results) {
    var collection = {results: results};
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(collection));
  });
};

//Db collection saver
exports.saveDocument = function(req, res, Collection) {
  Collection.save(req.body, function (err, result) {
    if (err) return console.log(err);
    var collection = {results: result};
    writeResultJson(res, collection)
    console.log(req.body);
    console.log('saved to database');
  });
};
