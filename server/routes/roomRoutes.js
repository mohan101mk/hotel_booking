import express from 'express';
import {
    addRoom,
    getAllRooms,
    getOwnerRooms,
    getRoomById,
    deleteRoom,
    getRoomForEdit,
    updateRoom
} from '../controllers/roomController.js';

import { authMiddleware, isOwner } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js'; // Needed for file upload routes

const roomRouter = express.Router();


roomRouter.post('/add-room', upload.single('image'), authMiddleware, isOwner, addRoom);


roomRouter.get('/edit/:id', authMiddleware, isOwner, getRoomForEdit);

roomRouter.put('/update/:id', upload.single('image'), authMiddleware, isOwner, updateRoom);

roomRouter.delete('/delete/:id', authMiddleware, isOwner, deleteRoom);

roomRouter.get('/my-rooms', authMiddleware, isOwner, getOwnerRooms);



roomRouter.get('/all-rooms', getAllRooms);

roomRouter.get('/:id', getRoomById);

export default roomRouter;