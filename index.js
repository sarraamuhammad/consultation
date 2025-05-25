const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const PORT = 8080;
const mongoose = require("mongoose");
const app = express();
app.use(cors());
const corsOptions = {
  origin: "http://localhost:3000", // Allow only your frontend's origin to access
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//starting app and database connection
mongoose
  .connect("mongodb+srv://mmghaly3:4Il0wSUKzkeOu1qP@users.iaf0wje.mongodb.net/")
  .then((result) =>
    app.listen(PORT, (req, res, next) => {
      console.log(`Server running on port ${PORT}`);
      const userRoutes = require("./routes/userRoutes");
      const matchRoutes = require("./routes/matchRoutes");
      const stadiumRoutes = require("./routes/stadiumRoutes");
      const ticketsRoutes = require("./routes/ticketsRoutes");
      const teamsRoutes = require("./routes/teamRoutes");
      app.use("/users", userRoutes);
      app.use("/matches", matchRoutes);
      app.use("/stadiums", stadiumRoutes);
      app.use("/tickets", ticketsRoutes);
      app.use("/teams", teamsRoutes);
      app.get("/", function (req, res) {
        res.send("Hello World!");
      });
    })
  )
  .catch((err) => console.log(err));
