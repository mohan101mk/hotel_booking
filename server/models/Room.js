import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    // --- Basic Info ---
    name: { type: String, required: true }, // e.g. "Deluxe Sea View"
    description: { type: String, required: true },
    price: { type: Number, required: true },

    // --- Location Info (Formerly Hotel fields) ---
    hotelName: { type: String, required: true }, // e.g. "Roomin Resort"
    address: { type: String, required: true },
    city: { type: String, required: true },

    // --- Details ---
    capacity: { type: Number, required: true },
    amenities: { type: [String], default: [] }, // ["Wifi", "AC"]

    // --- Images (We will handle this next) ---
    image: { type: String, required: true },

    // --- Ownership ---
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);
export default Room;