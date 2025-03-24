const { Router } = require("express");
const { userHomepageGet, userProfileGet, userCreateMessageGet, userCreateMessagePost, adminDeleteMessagePost } = require("../controllers/userController")

const userRouter = Router();

userRouter.get("/", userHomepageGet)
userRouter.get("/profile", userProfileGet)
userRouter.get("/create-message", userCreateMessageGet)
userRouter.post("/create-message", userCreateMessagePost)


module.exports = userRouter;