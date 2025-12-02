import express from 'express';
import { login, signup, getUserData } from '../controllers/userController.js'; // Note the .js extension
import { authMiddleware } from '../middleware/authMiddleware.js';
const userRouter = express.Router();

// Route: http://localhost:3000/api/signup
userRouter.post('/signup', signup);

// Route: http://localhost:3000/api/login
userRouter.post('/login', login);

// Route: http://localhost:3000/api/get-user
userRouter.get('/get-user', authMiddleware, getUserData);

export default userRouter;