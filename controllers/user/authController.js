// controllers/authController.js
import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  // Destructure all required fields, including specialty
  const { name, email, password, role, specialty } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      specialty, // Add specialty to the new user object
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Also, it's helpful to see the actual error message in the console
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");

    // --- Add this line for debugging ---
   // console.log("User object from DB:", user); 
    // ------------------------------------

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.role !== role) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
            console.error('JWT Signing Error:', err); 
            return res.status(500).json({ message: "Error signing token" });
        }
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Server error", error: error.message });
  }
};