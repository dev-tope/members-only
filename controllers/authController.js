const { createUser, createMember} = require("../db/queries")
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const validateUser = [
  body("firstname").trim()
    .isAlpha().withMessage(`First name must contain only letters`)
    .isLength({ min: 3, max: 50}).withMessage(`First Name must be longer than 3 characters but less than 50`),
  body("lastname").trim()
    .isAlpha().withMessage(`First name must contain only letters`)
    .isLength({ min: 3, max: 50}).withMessage(`Last Name must be longer than 3 characters but less than 50`),
  body("username").trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3-20 characters")
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage("Username can only contain letters, numbers, underscores and dashes")
    .escape(),
  body("password").trim()
    .notEmpty().withMessage("Password is required")
    .isLength({min: 3}).withMessage("Password must be longer than 3"),
  body("confirmPassword").trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }).withMessage("The passwords don't match")
]

const validateMember = [
  body("code").trim()
    .custom((value) => {
      return value === "1111";
    }).withMessage("Incorrect membership code. Contact admin.")
]

async function appSignUpGet(req, res) {
  res.status(200).render("sign-up")
}

async function appLoginGet(req, res) {
  res.status(200).render("log-in")
}

const appCreateNewUserPost = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    const user  = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    console.log(user)

    if(!errors.isEmpty()) {
      console.log(errors)
      return res.status(400).render("sign-up", {
        errors: errors.array()
      })
    }

    await createUser(user, hashedPassword);
    console.log(`User ${user.firstname} created`);
    res.redirect("/auth/log-in")  
  }
]

async function appCreateMemberGet(req, res) {
  try {
    // console.log(req.user)
    if(!req.user) {
      return res.redirect("/auth/log-in")
    }

    res.status(200).render("membershipForm",{ 
      user: req.user
      })
  } catch (error) {
    console.error("Error in membership form ", error);
    res.status(500).redirect("/login")
  }
}

const appCreateMemberPost = [
  validateMember, 
  async(req, res, next) => {
    const errors = validationResult(req);
    const username = req.params.username;

    if(!errors.isEmpty()) {
      console.log(errors)
      return res.status(400).render("membershipForm", {
        errors: errors.array()
      })
    }

    await createMember(username);
    console.log(username, " is now a member");
    res.redirect("/")
  }
]


module.exports = {
  appSignUpGet,
  appLoginGet,
  appCreateNewUserPost,
  appCreateMemberGet,
  appCreateMemberPost,
}