var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');
var db = nano.use('addresses');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/createdb', function(req, res) {
  nano.db.create(req.body.dbname, function(err) {
    if(err) {
      res.send("Error creating database " + req.body.dbname);
    } else {
      res.send("Database " + req.body.dbname + " created successfully");
    }
  });
});

router.post('/new-contact', function(req, res) {
  var name = req.body.name;
  var phone = req.body.phone;
  db.insert({ name:name, phone:phone, crazy:true }, phone, function(err, body, header) {
    if(err) {
      console.log(err);
      res.send("Error creating contact");
    } else {
      res.send("Contact was created successfully");
    }
  });
});

router.post('/view-contact', function(req, res) {
  var alldoc = "Following are the documents retrieved <br/><br/>";
  db.get(req.body.phone, { revs_info: true }, function(err, body) {
    if(err) {
      alldoc="No records exist with that number";
    } else {
      alldoc += "Name:" + body.name + "<br/> Phone:" + body.phone;
    }
    res.send(alldoc);
  });
});

module.exports = router;
