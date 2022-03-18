import "dotenv/config";

import express from "express";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import bcrypt from "bcrypt";
import flash from "express-flash";
import session from "express-session";
import methodOverride from "method-override";
import multer from "multer";

import initDatabase from "./helpers/db.helper";
import { UserService } from "./services/user.service";
import initializePassport from "./helpers/passportConfig";
import { uploadFile } from "./helpers/uploadFile";
import { fileFilter } from "./helpers/fileFilter";
import { ArticleService } from "./services/article.service";

initializePassport(
  passport,
  async (email) => await UserService.findOneByEmail(email),
  async (id) => await UserService.findByPk(id)
);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(bodyParser.json());

const storageFile = multer.diskStorage({});
const upload = multer({ storage: storageFile, file: fileFilter });

async function server() {
  await initDatabase();

  app.get("/", function (req, res) {
    res.render("home");
  });

  app.get("/signup", checkNotAuthenticated, function (req, res) {
    res.render("signup", { message: null });
  });

  app.post("/signup", checkNotAuthenticated, async function (req, res) {
    if (await UserService.findOneByEmail(req.body.email)) {
      res.render("signup", { message: "User not created" });
    } else if (req.body.password2 != req.body.password) {
      res.render("signup", { message: "Password not match" });
    } else {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const newUser = { ...req.body };
      delete newUser.password2;
      await UserService.save(newUser);
      res.redirect("signin");
    }
  });

  app.get("/signin", checkNotAuthenticated, function (req, res) {
    res.render("signin");
  });

  app.post(
    "/signin",
    checkNotAuthenticated,
    await passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/signin",
      failureFlash: true,
    })
  );

  app.delete("/logout", (req, res) => {
    req.logOut();
    res.redirect("/signin");
  });

  // Article routes

  app.post(
    "/author/articles",
    checkAuthenticated,
    upload.single("image"),
    async (req, res) => {
      try {
        req.body.image = await uploadFile(req);

        const data = {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          UserId: req.user.id,
        };

        await ArticleService.save(data);

        res.redirect("/author/articles");
      } catch (error) {
        console.log(error);
        res.redirect("/author/articles");
      }
    }
  );

  app.get("/author/articles", checkAuthenticated, async (req, res) => {
    const articles = await ArticleService.findAll();
    res.render("dashboard/view-blogs", { articles: articles });
  });

  app.get("/author/articles/new", checkAuthenticated, async (req, res) => {
    res.render("dashboard/create-blog");
  });

  app.get("/author/articles/:id", checkAuthenticated, async (req, res) => {
    const article = await ArticleService.findByPk(req.params.id);
    res.render("dashboard/view-blog", { article: article });
  });

  app.get("/blogs", async (req, res) => {
    const articles = await ArticleService.findAll();
    res.render("blogs", { articles: articles });
  });

  app.get("/blogs/:id", async (req, res) => {
    const article = await ArticleService.findByPk(req.params.id);
    res.render("blog", { article: article });
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/signin");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return next();
}

server();
