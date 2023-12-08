var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const post = require('./post');
const upload = require('./multer');
const localStrategy = require("passport-local").Strategy;
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()))
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  console.log(req.flash('error'));
  res.render('login', {error : req.flash('error')});
});

router.get('/profile', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts");
  console.log(user);
  res.render('profile',{user});
 
});

router.get('/feed',  async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const posts = await  postModel.find().limit(25).populate("user");
  res.render('feed',{user, posts});
});

router.post("/register", function(req, res) {
  const { username, email, fullName } = req.body;
  const userData = new userModel({ username: username, email, fullName });

  userModel.register(userData, req.body.password, function(err, user) {
    if (err) {
      console.error(err);
      return res.render('error', { error: err });
    }

    passport.authenticate("local")(req, res, function() {
      console.log("registered successfully and went to profile");
      res.redirect('/feed');
    });
  });
});




 router.post("/login",passport.authenticate('local',{
      successRedirect:'/feed',
      failureRedirect:'/login',
        failureFlash: true
    }) ,function(req,res){
    
    });

      router.get("/logout",function(req,res){
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });

      function isLoggedIn(req,res,next){
        if(req.isAuthenticated()) return next();
        res.redirect("/")
      }
  

    router.post('/upload', isLoggedIn, upload.single("file"), async function (req, res) {
        if(!req.file){
          return res.status(400).send('No files were uploaded.');
        }
       
        // jo file upload hui hai usse save as a post and uska post id user ko do and post ko userid
        const user = await userModel.findOne({username: req.session.passport.user});
      const postdata = await      postModel.create({
          image: req.file.filename,
          imageText: req.body.filecaption,
          user: user._id
        });
        user.posts.push(postdata);
         await user.save();
        res.redirect("/profile");
      })
     
   
      router.post('/update-profile', upload.single('profileImage'), async (req, res) => {
        if(!req.file){
          return res.status(400).send('No files were uploaded.');
        }
       
        // jo file upload hui hai usse save as a post and uska post id user ko do and post ko userid
        const user = await userModel.findOne({username: req.session.passport.user});
        user.dp = req.file.filename;
        await user.save(); 
        res.redirect("/profile");
      });
module.exports = router;
