const User = require("../models/users.models");
const argon2 = require("argon2"); //https://github.com/ranisalt/node-argon2/wiki/Options
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.JWT_SECRET;
// the client is sending this body object
//  {
//     email: form.email,
//     password: form.password,
//     password2: form.password2
//  }
const register = async (req, res) => {
  // this salt can be truly random with one of available npm packages
  const salt = "321dsa";
  const { email, password, password2 } = req.body;
  if (!email || !password || !password2) {
    return res.json({ ok: false, message: "All fields required" });
  }
  if (password !== password2) {
    return res.json({ ok: false, message: "Passwords must match" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ ok: false, message: "Invalid email" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) return res.json({ ok: false, message: "User exists!" });
    const hash = await argon2.hash(password, salt);
    // not salted, salt is appending a random string to a password to strengthen the hash
    const hash2 = await argon2.hash(password);
    // we cna see that hashes for salted and unsalted are different
    console.log("hash ==>", hash);
    console.log("hash2 ==>", hash2);
    const newUser = new User({
      email,
      password: hash,
    });
    await newUser.save();
    res.json({ ok: true, message: "Successfully registered" });
  } catch (error) {
    console.log(error);
    res.json({ ok: false, error });
  }
};
// the client is sending this body object
//  {
//     email: form.email,
//     password: form.password
//  }
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ ok: false, message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ ok: false, message: "Invalid email provided" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: false, message: "Invalid user provided" });
    const match = await argon2.verify(user.password, password);
    if (match) {
      // once user is verified and confirmed we send back the token to keep in localStorage in the client and in this token we can add some data -- payload -- to retrieve from the token in the client and see, for example, which user is logged in exactly. The payload would be the first argument in .sign() method. In the following example we are sending an object with key userEmail and the value of email coming from the "user" found in line 47
      const token = jwt.sign({ userEmail: user.email }, jwt_secret, {
        expiresIn: "365d",
      }); //{expiresIn:'365d'}
      // after we send the payload to the client you can see how to get it in the client's Login component inside handleSubmit function
      res.json({ ok: true, message: "welcome back", token, user });
    } else return res.json({ ok: false, message: "Invalid data provided" });
  } catch (error) {
    res.json({ ok: false, error });
  }
};

const verify_token = (req, res) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  jwt.verify(token, jwt_secret, (err, succ) => {
    err
      ? res.json({ ok: false, message: "Token is corrupted" })
      : res.json({ ok: true, succ });
  });
};

const add_List = async (req, res) => {
  const { email, listName } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.lists.find(list => list.name === listName)) {
      return res.status(400).json({ message: 'List already exists' });
    }
    user.lists.push({ name: listName, items: [] });
    await user.save();

    return res.status(200).json({ok: true, message: 'List added successfully' });
  } catch (error) {
    console.error('Error adding list:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const remove_List = async (req, res) => {
  const { email, listName } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.lists = user.lists.filter(list => list.name !== listName);
    await user.save();

    return res.status(200).json({ok:true, message: 'List removed successfully' });
  } catch (error) {
    console.error('Error removing list:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const add_Item = async (req, res) => {
  const { email, listName, item } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const list = user.lists.find(list => list.name === listName);
    if (!list) {
      return res.status(400).json({ message: 'List does not exist' });
    }
    list.items.push(item);
    await user.save();

    return res.status(200).json({ok:true, message: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const remove_Item = async (req, res) => {
  const { email, listName, item } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const list = user.lists.find(list => list.name === listName);
    if (!list) {
      return res.status(400).json({ message: 'List does not exist' });
    }
    list.items = list.items.filter(i => i !== item);
    await user.save();

    return res.status(200).json({ok:true, message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error removing item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



const get_Lists = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ok:true, lists: user.lists.map(list => list.name) });
  } catch (error) {
    console.error('Error getting lists:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const get_Items = async (req, res) => {
  const { email, listName } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const list = user.lists.find(list => list.name === listName);
    if (!list) {
      return res.status(400).json({ message: 'List does not exist' });
    }
    return res.status(200).json({ok:true, items: list.items });
  } catch (error) {
    console.error('Error getting items:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { register, login, verify_token, add_List, remove_List, add_Item, get_Lists, get_Items, remove_Item };
