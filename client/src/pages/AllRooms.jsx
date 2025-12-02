import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // <--- IMPORT useLocation
import { assets, facilityIcons } from '../assets/assets';
import StarRating from '../components/StarRating';
import axios from 'axios';

const AllRooms = () => {
    const navigate = useNavigate();
    const location = useLocation(); // <--- Initialize hook to read URL

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA FROM BACKEND (Now handles filters from URL) ---
    const fetchRooms = async () => {
        setLoading(true);

        // 1. Get the URL query string (e.g., ?city=Mumbai&capacity=2)
        const queryString = location.search;

        // 2. Append the query string to the base API URL
        const url = `${import.meta.env.VITE_API_URL}/api/rooms/all-rooms${queryString}`;

        try {
            const response = await axios.get(url);

            if (response.data.success) {
                setRooms(response.data.rooms);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // The EFFECT now runs when the component mounts AND when the URL query changes
    useEffect(() => {
        fetchRooms();
    }, [location.search]); // <--- DEPENDENCY ADDED
    // --- END FETCH LOGIC ---


    if (loading) return <div className='pt-32 text-center'>Loading Rooms...</div>

    return (
        <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>

            {/* --- HEADER --- */}
            <div className='flex flex-col items-start text-left mb-10'>
                <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
                <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
                    Showing {rooms.length} available results.
                </p>
            </div>

            {/* --- ROOM LIST (Now takes full width) --- */}
            <div>
                {rooms.map((room) => (
                    <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300'>

                        {/* IMAGE */}
                        <img
                            onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }}
                            src={room.image}
                            alt="hotel-img"
                            className='w-full md:w-1/2 max-h-64 rounded-xl shadow-lg object-cover cursor-pointer'
                        />

                        <div className='md:w-1/2 flex flex-col gap-2'>
                            {/* DATA */}
                            <p className='text-gray-500'>{room.city}</p>
                            <p onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }}
                                className='text-gray-800 text-3xl font-playfair cursor-pointer hover:text-blue-600 transition'>
                                {room.name}
                            </p>
                            <p className='text-gray-600 text-sm font-medium'>{room.hotelName}</p>

                            <div className='flex items-center'>
                                <StarRating />
                                <p className='ml-2 text-sm text-gray-500'>200+ reviews</p>
                            </div>

                            <div className='flex items-center gap-1 text-gray-500 text-sm'>
                                <img src={assets.locationIcon} alt="location" className='w-4' />
                                <span>{room.address}</span>
                            </div>

                            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                                        <img src={facilityIcons[item] || assets.starIconFilled} alt={item} className='w-4 h-4' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>

                            <p className='text-xl font-medium text-gray-700'>₹{room.price} /night</p>

                            <button onClick={() => navigate(`/rooms/${room._id}`)} className='bg-black text-white px-6 py-2 rounded-full mt-2 w-fit'>
                                View Details
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllRooms