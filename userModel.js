const mongoose = require("mongoose");
const validator = require("validator");

const userschema = mongoose.Schema;

const user = userschema({
  roll: {
    type: String,
    default: "basic",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email!");
      }
    },
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  confpassword: {
    type: String,
  },
});

module.exports = mongoose.model("user", user);
