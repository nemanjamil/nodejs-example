let bodyParser = require('body-parser');
let Article = require('../models/article')
let UserModel = require('../models/users')

const {
    check,
    validationResult
} = require('express-validator/check');

// Body Parser Middleware // create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

module.exports = function (app) {

    app.get('/', (req, res) => {
        Article.find({}, function (err, articles) {
            if (err) {
                console.log(err);
            } else {
                res.render("index", {
                    title: "Start Page",
                    articles: articles
                })
            }
        });
        //res.send("aaa");
    });


    app.get('/articles/add', ensureAuthenticated, (req, res) => {
        res.render('add_article', {
            title: 'Article'
        })
    })

    app.get('/article/:id', (req, res) => {

        Article.findById(req.params.id, function (err, article) {
            UserModel.findById(article.author, (err, cbuser) => {
                res.render('article', {
                    article: article,
                    image: "https://picsum.photos/300/200/?random",
                    author: cbuser.name
                });
            });

        })
    })

    app.get('/article/edit/:id', (req, res) => {
        Article.findById(req.params.id, function (err, article) {
            if (req.user._id != article.author) {
                req.flash('danger', 'Author property');
                res.redirect('/');
                return;
            }
            res.render('edit_article', {
                title: "Edit Article",
                article: article,
            });
        })
    })

    app.delete('/article/:id', (req, res) => {

        if (req.user._id != article.author) {
            res.status(500).send();
        }

        let query = {
            _id: req.params.id
        }

        Article.findById(req.params.id, (err, cbart) => {
            if (cbart.author != req.user._id) {
                res.status(500).send();
            } else {
                Article.remove(query, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("success")
                    }
                })
            }
        })

    })

    app.post('/articles/edit/:id', urlencodedParser, (req, res) => {
        let article = {}
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        let query = {
            _id: req.params.id
        }

        Article.update(query, article, function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article is Updated')
                res.redirect('/article/' + req.params.id);
            }
        });
    })

    app.post('/articles/add', urlencodedParser, [

            check('title', "Title must be a string and not empty").not().isEmpty(),
            //check('author', "Author must be a string and not empty").not().isEmpty(),
            check('body', "Body must be a string and not empty").not().isEmpty(),

        ],

        (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                //return res.status(422).json({ errors: errors.array() });
                res.render('add_article', {
                    title: "Add Article",
                    errors: errors.array()
                })
                console.log(errors.array());
                return;
            }



            let article = new Article();
            article.title = req.body.title;
            article.author = req.user._id; // when we are logged in User object egxist//req.body.author;
            article.body = req.body.body;
            article.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'Article is added', 'tri_i_cetiri')
                    res.redirect('/');
                }
            });
        })

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('danger', 'Please Log In');
            res.redirect('/user/login')
        }
    }
}