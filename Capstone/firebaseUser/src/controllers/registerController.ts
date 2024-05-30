import { db } from "../config/firebase";
import { Request, Response } from "express";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    // Extract the required data from the request body
    const { email, username, password, phoneNumber, fullname, profileImage } = req.body;

    // Check if all required fields are present
    if (!email) {
      return res.json({ success: false, message: "Email is required", userRegistered: [] });
    }

    if (!username) {
      return res.json({ success: false, message: "Username is required", userRegistered: [] });
    }

    if (!password) {
      return res.json({ success: false, message: "Password is required", userRegistered: [] });
    }

    if (!phoneNumber) {
      return res.json({ success: false, message: "Phone Number is required", userRegistered: [] });
    }

    if (!fullname) {
      return res.json({ success: false, message: "Full Name is required", userRegistered: [] });
    }

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ success: false, message: "Invalid email format", userRegistered: [] });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .json({ success: false, message: "Password should be at least 6 characters long", userRegistered: [] });
    }

    // Check if the email is already registered
    const existingUser = await db.collection("databaseUsers").where("email", "==", email).limit(1).get();
    if (!existingUser.empty) {
      return res.json({ success: false, message: "Email is already registered", userRegistered: [] });
    }

    // Generate a unique ID using nanoid
    const id = nanoid();

    // Create a new user object with the generated ID
    const newUser = {
      id,
      email,
      username,
      password,
      phoneNumber,
      fullname,
      profileImage,
    };

    // Store the user data in Firebase Firestore
    await db.collection("databaseUsers").doc(id).set(newUser);

    let snapshot = await db
      .collection("databaseUsers")
      .where("username", "==", username)
      .limit(1)
      .get();
      const user = snapshot.docs[0].data();
      res.json({
            success: true,
            message: "Register successful",
            userRegistered: [{
              id: user.id,
              email: user.email,
              username: user.username,
              password: user.password,
              phoneNumber: user.phoneNumber,
              fullname: user.fullname,
              profileImage: user.profileImage
            }],
          });
  } catch (error) {
    console.log(error);
    // Return a response indicating failure
    res.status(500).json({ success: false, message: "Failed to register user", userRegistered: [] });
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // Verify and decode the token to get the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    const { userId } = decodedToken;

    const { email, username, password, profileImage, fullname, phoneNumber } = req.body;

    // Check if fullname or phoneNumber is provided
    if (!fullname && !phoneNumber) {
      return res.json({ success: false, message: "Please provide fullname or phoneNumber", userUpdated: [] });
    }

    const updatedUserData: Partial<{ username: string; email: string; password: string; profileImage: string; fullname: string; phoneNumber: string }> = {};
    
    if (username) {
      updatedUserData.username = username;
    }

    if (email) {
      updatedUserData.email = email;
    }

    if (password) {
      updatedUserData.password = password;
    }

    if (profileImage) {
      updatedUserData.profileImage = profileImage;
    }

    if (fullname) {
      updatedUserData.fullname = fullname;
    }

    if (phoneNumber) {
      updatedUserData.phoneNumber = phoneNumber;
    }

    const userRef = await db.collection("databaseUsers").doc(userId).get();
    if (!userRef.exists) {
      return res.json({ success: false, message: "User not found", userUpdated: [] });
    }

    await db.collection("databaseUsers").doc(userId).update(updatedUserData);

    const updatedUserRef = await db.collection("databaseUsers").doc(userId).get();
    const updatedUser = updatedUserRef.data();

    res.json({
      success: true,
      message: "User updated successfully",
      userUpdated: [{
        email: updatedUser.email,
        username: updatedUser.username,
        password: updatedUser.password,
        profileImage: updatedUser.profileImage,
        phoneNumber: updatedUser.phoneNumber,
        fullname: updatedUser.fullname
      }],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to update user", userUpdated: [] });
  }
};

