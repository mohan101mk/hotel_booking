import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    totalPrice: { // Calculated total price
        type: Number,
        required: true
    },
    paymentStatus: { // Since we skip Stripe
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    bookingStatus: {
        type: String,
        enum: ['Confirmed', 'Cancelled'],
        default: 'Confirmed'
    }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;