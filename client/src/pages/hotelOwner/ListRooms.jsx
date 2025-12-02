import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate for Edit link
import { assets } from '../../assets/assets';

const ListRooms = () => {
    const navigate = useNavigate(); // Initialize navigate hook

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = `${import.meta.env.VITE_API_URL}/api/rooms`; // <--- Base API URL

    const fetchList = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_URL}/my-rooms`, {
                headers: { token }
            });

            if (response.data.success) {
                setList(response.data.rooms);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching data.");
        } finally {
            setLoading(false);
        }
    }

    // --- DELETE ROOM FUNCTION ---
    const deleteRoom = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room listing? This cannot be undone.")) return;

        try {
            const token = localStorage.getItem("token");

            // API Call: DELETE method to /api/rooms/delete/:id
            const response = await axios.delete(`${API_URL}/delete/${roomId}`, {
                headers: { token }
            });

            if (response.data.success) {
                alert(response.data.message || "Room deleted successfully!");

                // OPTIMIZATION: Update UI instantly by filtering out the deleted room
                setList(prevList => prevList.filter(room => room._id !== roomId));
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Deletion failed. Check console for details.");
            console.error("Delete API Error:", error);
        }
    }
    // --- END DELETE FUNCTION ---

    useEffect(() => {
        fetchList();
    }, []);

    if (loading) {
        return <div className="p-10 text-center">Loading your rooms...</div>;
    }

    return (
        <div className='w-full p-4'>
            <Title align='left' font='outfit' title='Room Listings' subTitle='Manage your listed rooms.' />

            <div className='flex flex-col gap-2 mt-8'>
                {/* Table Header: Added a column for Edit */}
                <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-medium'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Hotel</b>
                    <b>Price</b>
                    <b className='text-center'>Edit</b>
                    <b className='text-center'>Action</b>
                </div>

                {/* Table Body */}
                {list.map((item, index) => (
                    <div key={item._id} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center gap-2 py-3 px-3 border text-sm hover:bg-gray-50'>

                        {/* 1. Image */}
                        <img className='w-16 h-12 object-cover rounded' src={item.image} alt="" />

                        {/* 2. Name & Description */}
                        <div className='flex flex-col'>
                            <span className='font-semibold text-gray-800'>{item.name}</span>
                            <span className='text-xs text-gray-500 hidden sm:block'>{item.city}</span>
                        </div>

                        {/* 3. Hotel Name */}
                        <p className='text-gray-600 hidden md:block'>{item.hotelName}</p>

                        {/* 4. Price */}
                        <p>₹{item.price}</p>

                        {/* 5. EDIT BUTTON (NEW) */}
                        <button
                            onClick={() => navigate(`/owner/edit-room/${item._id}`)} // <--- WIRING THE EDIT LINK
                            className='bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs transition-all w-fit mx-auto'
                        >
                            EDIT
                        </button>

                        {/* 6. Delete Button */}
                        <button
                            onClick={() => deleteRoom(item._id)}
                            className='bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-xs transition-all w-fit mx-auto'
                        >
                            DELETE
                        </button>
                    </div>
                ))}

                {list.length === 0 && (
                    <div className="text-center py-10 text-gray-500 border border-dashed rounded mt-2">
                        <p>No rooms found. Go to "Add Room" to create one!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListRooms;