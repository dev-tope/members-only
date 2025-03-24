const pool = require("../db/pool");
const { createMessage, getMessagesByUsername, getAllMessages, deleteMessageByID } = require("../db/queries");

const { body, validationResult } = require("express-validator");

async function userHomepageGet(req, res) {
  const messages = await getAllMessages()
  console.log(messages)
  res.status(200).render("index", {user: req.user, messages: messages})
}

async function userProfileGet(req, res) {
  const username = req.user.username;
  const messages = await getMessagesByUsername(username);
  res.status(200).render("profile", { user: req.user, messages: messages })
}

async function userCreateMessageGet(req, res){
  res.status(200).render("create-message", { user: req.user })
}

async function userCreateMessagePost(req, res) {
  const { username } = req.user
  const title = req.body.title;
  const message = req.body.message;

  console.log(username, title, message)

  await createMessage(username, title, message)
  console.log("Message created by user:", username)
  res.redirect("/")
}

async function adminDeleteMessagePost(req, res) {
  const id = req.params.id;
  await deleteMessageByID(id);
  res.status(200).redirect("/");
}



module.exports = {
  userHomepageGet,
  userProfileGet,
  userCreateMessageGet,
  userCreateMessagePost,
  adminDeleteMessagePost,
}