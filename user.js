const express = require("express");
const USER = require("../models/userModel");
const { check, validationResult } = require("express-validator");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send({ msg: "Welcome user" });
});

router.get("/getUser/:id", async (req, res) => {
  try {
    USER.findOne({ _id: req.params.id }, function (err, response) {
      if (err) console.log(err);
      res.send(response);
    }).select("-_id -password");
  } catch (error) {
    res.status(403).send(error);
    console.log(error);
  }
});

router
  .route("/login")
  .post(
    [
      check("username", "User Name is required").notEmpty(),
      check("password", "password is required").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const username = req.body.username;
        const password = req.body.password;
        var givenroll = "basic";
        if (req.body.roll != undefined) {
          givenroll = req.body.roll;
        }
        const userfind = await USER.findOne({ username: username });
        if (userfind) {
          let ismatch = false;

          if (userfind.password == password) {
            ismatch = true;
          }
          if (ismatch) {
            res.send({ msg: "user found", result: userfind });
          } else {
            res.json({ msg: "password incorrect" });
          }
        } else {
          res.send("no user found");
        }
      } catch (error) {
        console.log(error);
        res.status(401).send(error);
      }
    }
  );

router
  .route("/register")
  .post(
    [
      check("username", "Name is required").notEmpty(),
      check("email", "Please include a valid email").isEmail(),
      check(
        "password",
        "Please enter a password with 6 or more characters"
      ).isLength({ min: 6 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        // return res.status(200).send({ msg: "user succesfully login", token })

        const password = req.body.password;
        const cpassword = req.body.confpassword;
        var givenroll = "basic";
        if (req.body.roll != undefined) {
          givenroll = req.body.roll;
        }
        if (password === cpassword) {
          const userdata = new USER({
            roll: givenroll,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
          });
          await userdata
            .save()
            .then(async () => {
              res.status(200).send({ msg: "user succesfully saved" });
            })
            .catch((err) => {
              // console.log("error", err);
              res.status(403).send({ error: err });
            });
        } else {
          res.send("password doesn't match!!");
        }
      } catch (error) {
        console.log("error", error);
        res.status(401).send({ error: error });
      }
    }
  );

router.route("/getAccType/:username").get(async (req, res) => {
  USER.findOne({ username: req.params.username }, "roll", (err, result) => {
    if (err) return res.status(403).send(err);
    return res.json(result);
  }).select("-_id");
});

module.exports = router;
