const { Router } = require("express");
const passport = require("passport")
const { appSignUpGet, appLoginGet, appCreateNewUserPost, appCreateMemberGet, appCreateMemberPost } = require("../controllers/authController")

const authRouter = Router();

authRouter.get("/sign-up", appSignUpGet);
authRouter.get("/log-in", appLoginGet);
authRouter.get("/membership/:username", appCreateMemberGet)
authRouter.post("/membership/:username", appCreateMemberPost)
authRouter.post("/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/log-in",
    failureFlash: true,
  })
);
authRouter.post("/sign-up", appCreateNewUserPost);

module.exports = authRouter;