const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});

app.post("/form-api", (req, res) => {
  const { email, password } = req.body;

  if (email && email.trim() !== "" && password && password.trim() !== "") {
    res.json({ status: "OK" });
  } else {
    res.json({ status: "fail" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
