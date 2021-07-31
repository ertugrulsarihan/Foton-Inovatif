const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const http = require("http").createServer(app);
const io = new Server(http, {
  cors: {},
});
app.use(express.json());
app.use(cors());

const users = [
  {
    id: 1,
    username: "Ertugrul",
    password: "123456",
  },
  { id: 2, username: "Pelin", password: "123456" },
  { id: 3, username: "Osman", password: "123456" },
];

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, "mySecretKey", {
    expiresIn: "5h",
  });
};

io.on("connection", (socket) => {
  var currentdate = new Date();
  var datetime =
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  console.log(`Im working and Im  ${socket.id}`);
  socket.emit("datetime", datetime);
});

app.get("/", (req, res) => {
  res.send(users);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    const accessToken = generateAccessToken(user);
    res.json({
      username: user.username,
      accessToken,
    });
  } else {
    console.log("Bağlantı geçersiz");
  }
});

http.listen(8000, () => {
  console.log("Console is working ");
});
