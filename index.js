require('dotenv').config();
const  express = require('express');
const session = require("express-session");
const mongoose = require("mongoose");
const routes=require('./routers/router');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

session.message;

// Configure session middleware
app.use(session({
    secret: "44059ef122d74ff6a2a8f5844384bbb951e3ac59172e9b606d1f2e031ea7186a",
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(express.static('upload'));

app.use((err,req,res,next) => {
    console.log(err)
    res.status(500).send("INTERNAL SERVER ERROR")
});

app.use("/", routes);

mongoose.connect(process.env.DB_URI)
.then(() => {
    console.log("Database connected");
})
.catch((err) => {
    console.log(err);
});
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

