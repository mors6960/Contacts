const express = require("express");
const session = require("express-session");
const user = require("../models/user");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
// Configure session middleware
router.use(session({
  secret: "my secret key",
  resave: true,
  saveUninitialized: true,
}));

// Define multer storage configuration
const storage = multer.diskStorage({
  destination: "./upload",

  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);


  },
});

const upload = multer({ storage: storage }).single("image");
//get all user records 


// router.get("/",(req,res)=>{
 
// })





router.get("/", async (req, res) => {
  try {
    const users = await user.find().exec(); // Fetch users from the database
    const message = req.session.message; // Retrieve the message from the session
    delete req.session.message; // Remove the message from the session

    res.render("index", {
      title: "Home Page",
      users: users, // Pass the users data to the view
      message: message, // Pass the message to the view
    });
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to fetch users",
    };
    res.redirect("/");
  }
});



router.get('/delete/:id',upload, async (req, res) => {
  const userId = req.params.id; 

  try {
    const deletedUser = await user.findByIdAndDelete(userId);
    if (!deletedUser) {
      
      return  req.session.message = {
        type: "danger",
        message: "User not found",
      };
    }

    if (deletedUser.image) {
      fs.unlinkSync(`upload/${deletedUser.image}`);
    }
    req.session.message = {
      type: "success",
      message: "User deleted successfully",
    };
    res.redirect("/")
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});
router.get("/", (req, res) => {
  res.render("index", { title: "Home page" });
});


router.get("/add", (req, res) => {
  res.render("add_user", { title: "Add new user" });
});



router.get("/edit/:id",upload, async (req, res) => {
  const id = req.params.id;

  try {
    const user_record = await user.findById(id);
    if (!user_record) {
      req.session.message = {
        type: "danger",
        message: "User not found",
      };
      return res.redirect("");
    }

    res.render("edit_user", {
      title: "Edit User",
      user: user_record,
    });

  } catch (err) {
    console.log(err);
    req.session.message = {
      type: "danger",
      message: "Error fetching user details",
    };
    res.redirect("/");
  }
});

router.post("/add", upload, async (req, res) => {
  try {
    const user_record = await new user({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });

    await user_record.save();

    req.session.message = {
      type: "success",
      message: "User added successfully",
    };
    console.log("User added successfully:", req.session.message); // Log success message
    res.redirect("/");
  } catch (err) {
    console.error("Error adding user:", err); // Log error message
    req.session.message = {
      type: "danger",
      message: err.message || "Error occurred while adding user",
    };
    res.redirect("/");
  }
});
router.get("/add", (req, res) => {
  console.log("Session message:", req.session.message); // Check if session message is set
  res.render("add_user", { title: "Add new user", message: req.session.message });
});



// router.post("/add", upload, async (req, res) => {
//   try {
//     con

router.post('/update/:id', upload, async(req,res)=>{
  const id = req.params.id;
  const new_image = req.file ? req.file.filename : 
  req.body.old_image;
  try{
       const updatedUser = await user.findByIdAndUpdate(id,{
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            image : new_image
       },{new:true});
       if (req.file) {
            fs.unlinkSync(`upload/${req.body.old_image}`);
        }
        req.session.message = {
            type:'Success',
            message :'User Updated',
       };
       res.redirect('/');
  }

  catch(err){
       console.log(err);
       req.session.message = {
            type:'Error',
            message: 'Failed to update user',
       };
       res.redirect('/');
  }
});

module.exports = router;
