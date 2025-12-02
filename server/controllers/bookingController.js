import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";


const calculateNights = (checkIn, checkOut) => {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    const diffDays = Math.round(Math.abs((checkIn - checkOut) / oneDay));
    return diffDays > 0 ? diffDays : 1; // Ensure a minimum of 1 night
}



export const checkAvailability = async (req, res) => {
    try {

        const { roomId, checkInDate, checkOutDate } = req.body;


        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);


        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid date format submitted." });
        }

        const overlappingBookings = await Booking.find({
            roomId,
            bookingStatus: 'Confirmed',

            checkInDate: { $lt: checkOut }, // Existing check-in must be before new check-out
            checkOutDate: { $gt: checkIn }   // Existing check-out must be after new check-in
        });

        if (overlappingBookings.length > 0) {
            return res.json({ success: false, message: "Room is unavailable for these dates." });
        }

        // Fetch room price for the next step
        const room = await Room.findById(roomId);

        return res.json({
            success: true,
            message: "Room is available!",
            roomPrice: room.price
        });

    } catch (error) {
        console.error("Availability Check Error:", error);
        res.status(500).json({ success: false, message: "Server error during check." });
    }
}

// 2. API to Create Booking Record (Protected)
export const createBooking = async (req, res) => {
    try {
        const { userId, roomId, checkInDate, checkOutDate, guests, roomPrice } = req.body;

        // Calculate total price based on dates and room price
        const nights = calculateNights(new Date(checkInDate), new Date(checkOutDate));
        const totalPrice = nights * roomPrice;

        const newBooking = new Booking({
            userId,
            roomId,
            checkInDate,
            checkOutDate,
            guests,
            totalPrice,
            paymentStatus: 'Pending', // Default status as we skip payment gateway
        });

        await newBooking.save();

        res.json({ success: true, message: "Booking confirmed (Payment Pending)", bookingId: newBooking._id });

    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ success: false, message: "Server error during booking." });
    }
}

export const getMyBookings = async (req, res) => {
    try {

        const { userId } = req.body;


        const bookings = await Booking.find({ userId })
            .populate({
                path: 'roomId',
                select: 'name price image hotelName city' // Select only necessary room fields
            })
            .select('-__v -updatedAt'); // Exclude boilerplate fields

        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Get Bookings Error:", error);
        res.status(500).json({ success: false, message: "Error fetching bookings." });
    }
}

export const getOwnerDashboardStats = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(`--- DASHBOARD ACCESS by User: ${userId} ---`);
        const ownerRooms = await Room.find({ ownerId: userId }).select('_id');
        const ownerRoomIds = ownerRooms.map(room => room._id);
        console.log("Owner's Room IDs Found:", ownerRoomIds);


        const stats = await Booking.aggregate([

            { $match: { roomId: { $in: ownerRoomIds } } },
            // Group and calculate totals
            {
                $group: {
                    _id: null,
                    totalBookings: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            // Project the results
            { $project: { _id: 0, totalBookings: 1, totalRevenue: 1 } }
        ]);


        const recentBookings = await Booking.find({ roomId: { $in: ownerRoomIds } })
            .sort({ createdAt: -1 }) // Newest first
            .limit(5)
            .populate('userId', 'username') // Get username for display
            .populate('roomId', 'name'); // Get room name for display

        const dashboardData = {
            stats: stats[0] || { totalBookings: 0, totalRevenue: 0 },
            recentBookings
        };

        res.json({ success: true, data: dashboardData });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: "Error fetching dashboard data." });
    }
}