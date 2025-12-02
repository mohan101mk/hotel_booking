import express from 'express';
import { checkAvailability, createBooking, getMyBookings, getOwnerDashboardStats } from '../controllers/bookingController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';


const bookingRouter = express.Router();


bookingRouter.post('/check', checkAvailability);

bookingRouter.post('/create', authMiddleware, createBooking);
bookingRouter.get('/my-bookings', authMiddleware, getMyBookings);
bookingRouter.get('/dashboard-stats', authMiddleware, getOwnerDashboardStats);
export default bookingRouter;