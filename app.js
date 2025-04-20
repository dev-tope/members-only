const express = require("express");
const flash = require("connect-flash")
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv");
const path = require("path");
const pool = require("./db/pool")
const passport = require("passport");
const bcrypt = require("bcryptjs");
const authRouter = require("./routes/authRoutes");
const userRouter= require("./routes/userRoutes");
const adminRouter = require("./controllers/adminRoutes");
const emoji = require("node-emoji");


const { getAllMessages } = require('./db/queries');


const app = express()
dotenv.config()

const PORT = process.env.PORT;

app.locals.emoji = emoji;

app.use(session({
  secret: "12345",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.session())
app.use(flash())

passport.use(
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  },
  async (req, username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password)

      if(!user) {
        return done(null, false, req.flash("loginError", "No user found"))
      }
      
      if(!match) {
        return done(null, false, req.flash("loginError", "Incorrect password"))
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user)
  } catch (error) {
    done(error);
  }
})

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next()
});

//Routes
app.get("/", async (req, res) => {
  // if(req.isAuthenticated()) {
  //   return res.redirect(`${req.user.username}`)
  // } else {
  //   return res.redirect("/auth/log-in")
  // }
  const messages = await getAllMessages()
  // console.log("messages here", messages)

  if(req.isAuthenticated()) {
    return res.redirect(`${req.user.username}`)
  } else {
    return res.render("homepage", 
      { 
        messages: messages, 
        senderEmoji: emoji.get("bust_in_silhouette"), 
        timeEmoji: emoji.get("alarm_clock") 
      }
    );
  }
})

app.use("/auth", authRouter);
app.use("/admin", adminRouter)
app.use("/:username", userRouter);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } 
    res.redirect("/")
  })
})


//views config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})