const path = require("path");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.login = (req, res, next) => {
  res.render("admin/login", {
    pageTitle: "Add Product",
    path: "/login",
    editing: false,
    message: 0,
  });
};

exports.postLogin = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const userData = await User.findOne({ username: username });
  if (userData) {
    bcrypt
      .compare(password, userData.password)
      .then((isTrue) => {
        if (isTrue) {
          try {
          //create jwt token
            const token = jwt.sign({ username: username }, "AkashKumar", {
              expiresIn: 100000,
            });
            //save token in cookie
            res.cookie("authcookie", token, {
              maxAge: 9000000,
              httpOnly: true,
            });
            res.render("admin/generate-bill", {
              pageTitle: "Add Product",
              path: "/bill",
              editing: false,
              loggedIn: 1,
            });
          } catch (err) {
            console.log("Login Issue",err);
          }
        } else {
          res.render("admin/login", {
            pageTitle: "Add Product",
            path: "/login",
            editing: false,
            message: 10,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  } else {
    res.render("admin/login", {
      pageTitle: "Add Product",
      path: "/login",
      editing: false,
      message: 10,
    });
  }
};
exports.signup = (req, res, next) => {
  const password = req.body.password;
  const username = req.body.username;
  if (!username) {
    res.status(501).json({
      message: "user not created",
      userId: "Empty Username",
    });
    return;
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        password: hashedPassword,
        username: username,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "user created",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.tokenAuth = (req, res, next) => {
  try{
    const authcookie = req.cookies.authcookie;
    jwt.verify(authcookie, "AkashKumar", (err, data) => {
      if (err) {
        res.render("admin/login", {
          pageTitle: "Add Product",
          path: "/login",
          editing: false,
          message: 10,
        });
      } else if (data) {
        next();
      }
    });
  }
  catch(e){
    console.log("Error verifying Token", e)
  }
};
