const express = require("express");
const accRouter = express.Router();
const authMiddleware = require("../middleware");
const { User, account } = require("../db");
const { default: mongoose } = require("mongoose");

accRouter.get("/balance", authMiddleware, async (req, res) => {
  const acc = await account.findOne({
    userId: req.userId,
  });

  if (!acc) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.json({
    balance: acc.balance,
  });
});

accRouter.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, to } = req.body;
  const Amount = Number(amount);
  const from = await account
    .findOne({
      userId: req.userId,
    })
    .session(session);
  ///
  if (from.balance < Amount) {
    await session.abortTransaction();
    res.json({
      msg: "Insufficient balance",
    });
  }
  console.log(from._id);
  console.log(from.balance - Amount);

  const reciever = to.json;
  const toAcc = await account.findOne({ userId: to }).session(session);
  console.log(toAcc._id);
  console.log(toAcc.balance + Amount);
  if (!toAcc) {
    await session.abortTransaction();
    res.json({
      msg: "User not found ",
    });
  }
  await account
    .updateOne(
      { userId: from },
      {
        $inc: {
          balance: -Amount,
        },
      }
    )
    .then(() => {
      console.log(from.balance);
    });

  // await account.updateOne(
  // { userId: from },
  // {
  // $inc: {
  // balance: -Amount,
  // },
  // }
  // );

  await account
    .updateOne(
      {
        userId: toAcc,
      },
      {
        $inc: {
          balance: +Amount,
        },
      }
    )
    .then(() => {
      console.log(toAcc.balance);
    });

  await session.commitTransaction();
  res.json({
    msg: "Transfer Successful",
    balance: from.balance,
  });
});

module.exports = accRouter;
