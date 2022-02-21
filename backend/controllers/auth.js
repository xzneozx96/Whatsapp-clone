const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ msg: "Username and password are required !", success: false });

    // check for duplicate users in the db
    const duplicate = await User.findOne({ username: username });

    if (duplicate)
      return res
        .status(409)
        .json({ success: false, msg: "Duplicated Username" }); // conflic status code

    try {
      // encrypt the password
      const hashed_pw = await bcrypt.hash(password, 10);

      // update Database
      const new_user = new User({ username: username, password: hashed_pw });
      await new_user.save();

      return res
        .status(201)
        .json({ success: true, msg: "New account has been created" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, msg: "Username and password are required !" });

    // check if the entered username exists
    const found_user = await User.findOne({ username: username });

    if (!found_user)
      return res.status(401).json({ success: false, msg: "Account not found" }); // 401: Unauthorized server code

    // evaluate password
    const is_pw_matched = await bcrypt.compare(password, found_user.password);
    if (is_pw_matched) {
      // generate access and refresh token
      const access_token = jwt.sign(
        {
          userId: found_user._id,
          username: found_user.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      const refresh_token = jwt.sign(
        {
          username: found_user.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // save refresh_token of the recently logged-in user to database
      await User.findByIdAndUpdate(found_user._id, {
        refreshToken: refresh_token,
      });

      // send back to client the refresh_token securely via "httpOnly" which is not available to javascript - cookies must be sent right before the json in order to succeed
      res.cookie("jwt", refresh_token, {
        httpOnly: true,
        secure: true, // set to false while testing with thunder client / postman, set to true while testing with front-end
        sameSite: "None",
        maxAage: 24 * 60 * 60 * 1000, // equal to 1 day in milliseconds
      });

      // send back to client the success message and the access_token
      return res.status(200).json({ access_token });
    } else {
      return res
        .status(401)
        .json({ success: false, msg: "Incorrect Password !" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.sendStatus(204);
    }

    const refresh_token = cookies.jwt;

    // check if the refresh_token is in the database.
    const found_user = await User.findOne({ refreshToken: refresh_token });

    // If it does NOT exists but we do have a cookie, clear the cookie.
    if (!found_user) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(204);
    }

    // If it does exists, delete the refresh_token in the database and clear the cookie as well
    // update the database
    await User.findByIdAndUpdate(found_user._id, {
      refreshToken: "",
    });

    // clear cookie
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });

    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt)
      return res.status(401).json({
        msg: "You are not allowed to perform this action",
        success: false,
      }); // Unauthorized

    const refresh_token = cookies.jwt;

    // check if the user who is sending refresh_token request exists
    const found_user = await User.findOne({ refreshToken: refresh_token });

    if (!found_user)
      return res.status(403).json({
        msg: "You are not allowed to perform this action",
        success: false,
      }); // Forbidden

    // evaluate refresh_token
    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded_jwt) => {
        if (err || found_user.username !== decoded_jwt.username)
          return res
            .status(403)
            .json({ msg: "Refresh Token has expired", success: false });

        // once the refresh_token has been verified, send back a new access_token
        const new_access_token = jwt.sign(
          { username: decoded_jwt.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "5m" }
        );

        // send back the new access token to client
        return res.status(200).json({ access_token: new_access_token });
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = { register, login, refreshToken, logout };
