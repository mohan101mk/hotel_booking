import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
}


const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // 2. Validate email format (Optional but recommended)
        if (!email.includes("@")) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // 3. Validate password length
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // 4. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Generate "Initials Avatar" URL (e.g., "JD" for John Doe)
        const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff`;

        // 6. Create the new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            image: image, // Use the generated URL
            role: "user"  // Default role
        });

        // 7. Save to Database
        const user = await newUser.save();

        // 8. Generate Token
        const token = createToken(user._id);

        // 9. Send Response
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                image: user.image,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in Signup" });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // 2. Compare Passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // 3. Generate Token
        const token = createToken(user._id);

        // 4. Send Response
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                image: user.image,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in Login" });
    }
}





const getUserData = async (req, res) => {
    try {
        // 1. Get userId from the middleware (remember req.body.userId?)
        const { userId } = req.body;

        // 2. Find user in DB
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // 3. Send back only what the frontend needs
        res.json({
            success: true,
            userData: {
                name: user.username,
                email: user.email,
                role: user.role,
                image: user.image

            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
export { login, signup, getUserData };