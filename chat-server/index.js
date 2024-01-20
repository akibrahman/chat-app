const {
  MongoClient,
  ServerApiVersion,
  serialize,
  ObjectId,
} = require("mongodb");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const ChatModel = require("./Models/ChatModel");
const MessageModel = require("./Models/MessageModel");
const UserModel = require("./Models/UserModel");

//!------------------------------------------------
// const { Server } = require("socket.io");

const port = process.env.PORT || 5000;
const app = express();

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
mongoose.connect(process.env.MONGO_URI, { dbName: "ChatApp" });

//! Chat ---------------------------------------------
// const http = require("http");
// const chatApp = express();
// const chatServer = http.createServer(chatApp);
// const io = new Server(chatServer, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//     ],
//   },
// });

//!-------------------------------------------------

//! Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chat-app-akib.web.app",
      "https://chat-app-akib.firebaseapp.com",
    ],
    // credentials: true,
    // optionsSuccessStatus: 200,
  })
);
app.use(express.json());

//!First Responce
app.get("/", (req, res) => {
  res.send("Chat Server is Running");
});

//! All Methodes
const run = async () => {
  try {
    console.log("MongoDB Running");
    //! Collections
    const allMealsCollection = client.db("MealMasterDB").collection("AllMeals");
    //! Save or Modify User
    app.put("/all-users", async (req, res) => {
      try {
        const email = req.query.email;
        const user = req.body;
        const filter = { email };
        const update = {
          $set: { name: user.name, email: user.email },
        };
        const options = {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        };

        const result = await UserModel.findOneAndUpdate(
          filter,
          update,
          options
        );

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    //! Get one user from DB by Email
    app.get("/get-user/:email", async (req, res) => {
      const email = req.params.email;
      const user = await UserModel.findOne({ email });
      res.send(user);
    });
    //! Get one user from DB by ID
    app.get("/get-userr/:id", async (req, res) => {
      const id = req.params.id;
      const user = await UserModel.findOne({ _id: id });
      res.send(user);
    });
    //! createChat
    app.post("/chat", async (req, res) => {
      try {
        const newChat = new ChatModel({
          members: [req.body.senderId, req.body.receiverId],
        });
        const result = await newChat.save();
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
    });
    //! userChat
    app.get("/chat/:userId", async (req, res) => {
      try {
        const chat = await ChatModel.find({
          members: { $in: [req.params.userId] },
        });
        res.status(200).json(chat);
      } catch (error) {
        res.status(400).json(error);
      }
    });
    //! findChat
    app.get("/chat/find/:firstId/:secondId", async (req, res) => {
      try {
        const chat = await ChatModel.findOne({
          members: { $all: [req.params.firstId, req.params.secondId] },
        });
        res.status(200).json(chat);
      } catch (error) {
        res.status(500).json(error);
      }
    });
    //!-----------------
    //!addMessage
    app.post("/message", async (req, res) => {
      try {
        const { chatId, senderId, text } = req.body;
        const message = new MessageModel({
          chatId,
          senderId,
          text,
        });
        const result = await message.save();
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
    });
    //!getMessage
    app.get("/message/:chatId", async (req, res) => {
      try {
        const { chatId } = req.params;
        const result = await MessageModel.find({ chatId });
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
    });
  } finally {
  }
};
run().catch(console.dir);

//! App listener
app.listen(port, () => {
  console.log(`Chat Server is running on port: ${port}`);
});
