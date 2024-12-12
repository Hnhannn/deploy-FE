import { jwtDecode } from "jwt-decode";
import axios from "axios";
import axiosInstance from "../config/axiosConfig";

const API_URL = "http://localhost:8080/rest/users";

//app.use(bodyParser.json());
// Hàm giải mã token và lấy thông tin user từ token
export const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken; // Thông tin user trong token
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

// Hàm kiểm tra token hết hạn

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Invalid token", error);
    return true;
  }
};

export const getUserByUsername = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
};

export const updateProfile = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/updateProfile/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await axios.post(
      `${API_URL}/changePassword`,
      passwordData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error changing password:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};




// app.use(bodyParser.json());

// // MongoDB connection setup
// mongoose.connect('mongodb://localhost:27017/user-profile-db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Mongoose schema to define the user profile
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   website_url: { type: String },
//   facebook_link: { type: String },
//   note: { type: String },
//   cccd: { type: String },
//   phone: { type: String },
//   email: { type: String },
//   profile_image: { type: String }, // Base64 encoded image or file URL
//   file: { type: String }, // Optional file for uploading images
// });

// const User = mongoose.model('User', userSchema);

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads'); // Save files in 'uploads' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Unique filename
//   }
// });
// const upload = multer({ storage: storage });

// // API endpoint to update user profile
// app.post('/api/update-profile', upload.single('file'), async (req, res) => {
//   try {
//     // Gather data from request body
//     const { username, website_url, facebook_link, note, cccd, phone, email } = req.body;
//     let profile_image = req.body.profile_image; // This could be base64 encoded or an uploaded file

//     // If a file is uploaded, we save the file path in the database
//     if (req.file) {
//       profile_image = req.file.path;
//     }

//     // If user already exists, update their profile
//     let user = await User.findOne({ username });
//     if (user) {
//       // Update existing user profile
//       user.website_url = website_url;
//       user.facebook_link = facebook_link;
//       user.note = note;
//       user.cccd = cccd;
//       user.phone = phone;
//       user.email = email;
//       user.profile_image = profile_image;

//       await user.save();
//       return res.status(200).json({ message: 'Profile updated successfully!' });
//     }

//     // If user doesn't exist, create a new profile
//     const newUser = new User({
//       username,
//       website_url,
//       facebook_link,
//       note,
//       cccd,
//       phone,
//       email,
//       profile_image,
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'Profile created successfully!' });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ message: 'Server error, please try again later.' });
//   }
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server running on port 3000');
// });

// const express = require('express');
//   const mongoose = require('mongoose');
//   const multer = require('multer');
//   const bodyParser = require('body-parser');

//   const formData = new FormData();
// formData.append('username', user.username);
// formData.append('website_url', url);
// formData.append('facebook_link', facebookLink);
// formData.append('note', note);

// // Add profile image if it exists
// if (profileImageFile) {
//   formData.append('file', profileImageFile);
// }

// // Send request to API
// fetch('/api/update-profile', {
//   method: 'POST',
//   body: formData,
// })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Profile updated:', data);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
