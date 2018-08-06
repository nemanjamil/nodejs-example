let mongoose = require('mongoose')
//mongoose.connect('mongodb://localhost/nodekb',{ useNewUrlParser: true }); 
mongoose.connect("mongodb://localhost:27017/nodekb", { useNewUrlParser: true });
let db = mongoose.connection;
// Check for DB errors
db.on('error', function (err) {
    console.log('error DB, please check');
});

db.once('open', function () {
    console.log('Connected to Mongo Db');
})