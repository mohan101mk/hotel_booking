import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js'

// Connect to services
connectDB();
connectCloudinary();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());


app.use((req, res, next) => {

    next();
});


app.use('/api', userRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

app.get('/', (req, res) => res.send('API Working'));


app.use((err, req, res, next) => {
    console.error("🔥 SERVER CRASHED HERE:", err);
    res.status(500).json({ success: false, message: "Server Error: " + err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  