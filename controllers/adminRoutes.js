const { Router } = require("express")
const { adminDeleteMessagePost } = require("../controllers/userController.js")

const adminRouter = Router();

adminRouter.post("/delete/:id", adminDeleteMessagePost)

module.exports = adminRouter;