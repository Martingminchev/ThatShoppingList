const express = require("express")
const app = express()
const port = process.env.port || 3040;
require("dotenv").config();
//================ Enabling express to use body of the request ================================
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//================ CORS ================================
const cors = require("cors");
app.use(cors());
// =============== DATABASE CONNECTION =====================
const mongoose = require("mongoose");
// to print incoming requests from mongoose in the terminal
mongoose.set('debug',true)
async function connecting() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to the DB");
  } catch (error) {
    console.log(
      "ERROR: Seems like your DB is not running, please start it up !!!"
    );
  }
}
connecting();

// =============== ROUTES ==============================
app.use("/users", require("./routes/users.routes"));
// =============== START SERVER =====================
app.listen(port, () => console.log(`server listening on port ${port}`));