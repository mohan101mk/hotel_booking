import Room from "../models/Room.js";
import { v2 as cloudinary } from 'cloudinary';



// 1. CREATE: Add New Room (Owner Only)
const addRoom = async (req, res) => {
    try {


        const imageFile = req.file;
        if (!imageFile) return res.json({ success: false, message: "Please upload an image" });

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        const imageUrl = imageUpload.secure_url;

        const { name, description, price, hotelName, address, city, capacity, userId } = req.body;

        if (!name || !price || !hotelName) return res.json({ success: false, message: "Missing required details" });

        let amenitiesList = req.body.amenities;
        if (amenitiesList && !Array.isArray(amenitiesList)) amenitiesList = [amenitiesList];

        const newRoom = new Room({
            name, description,
            price: Number(price),
            hotelName, address, city,
            capacity: Number(capacity),
            amenities: amenitiesList || [],
            image: imageUrl,
            ownerId: userId
        });

        await newRoom.save();
        res.json({ success: true, message: "Room Added Successfully!" });

    } catch (error) {
        console.log("Error in addRoom:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// 2. READ: Get All Rooms (Public - FINAL UNFILTERED VERSION)
const getAllRooms = async (req, res) => {
    try {
        // Fetch ALL documents without any filtering
        const rooms = await Room.find({});

        res.json({ success: true, rooms });
    } catch (error) {
        console.error("Get All Rooms Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// 3. READ: Get Owner's Rooms (Dashboard List)
const getOwnerRooms = async (req, res) => {
    try {
        const { userId } = req.body;

        const rooms = await Room.find({ ownerId: userId });

        res.json({ success: true, rooms });
    } catch (error) {
        console.log("Error in getOwnerRooms:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// 4. READ: Get Single Room by ID (Public Detail Page)
const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id);

        if (!room) return res.status(404).json({ success: false, message: "Room not found." });

        res.json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 5. READ: Get Single Room for Edit Form (Owner Check)
const getRoomForEdit = async (req, res) => {
    try {
        const roomId = req.params.id;
        const room = await Room.findById(roomId);

        if (!room) return res.status(404).json({ success: false, message: "Room not found for edit." });

        res.json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching room data for edit." });
    }
}


// 6. UPDATE: Update Room Data (Owner Only)
const updateRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const { name, price, description, hotelName, address, city, capacity, amenities } = req.body;

        let imageUrl = req.body.image;

        if (req.file) {
            // Placeholder: In a complete app, you would upload the new image here.
            imageUrl = "NEW_IMAGE_UPLOADED_URL";
        }

        const updateData = {
            name, price: Number(price), description, hotelName, address, city, capacity: Number(capacity),
            amenities: Array.isArray(amenities) ? amenities : [amenities],
            image: imageUrl
        };

        const room = await Room.findByIdAndUpdate(roomId, updateData, { new: true, runValidators: true });

        if (!room) return res.status(404).json({ success: false, message: "Room not found for update." });

        res.json({ success: true, message: "Room updated successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 7. DELETE: Delete Room by ID (Owner Only)
const deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.id;

        await Room.findByIdAndDelete(roomId);

        res.json({ success: true, message: "Room deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


// Consolidated Export
export {
    addRoom,
    getAllRooms,
    getOwnerRooms,
    getRoomById,
    deleteRoom,
    getRoomForEdit,
    updateRoom,
};