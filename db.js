const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://kartikeynamdev:vinayak2003@mycluster.hjnalxi.mongodb.net/"
  )
  .then(() => {
    console.log("Mongoose connected");
  });

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
});
const User = mongoose.model("User", userSchema);

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const account = mongoose.model("Accounts", accountSchema);

module.exports = {
  User,
  account,
};
