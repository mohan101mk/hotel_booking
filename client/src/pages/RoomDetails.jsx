import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets'
import StarRating from '../components/StarRating'
import axios from 'axios'
import '../index.css'

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- LOGIC STATES ---
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null);

    // --- BOOKING/FORM STATES ---
    const [formData, setFormData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guests: 1,
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [isAvailable, setIsAvailable] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    // --- HELPER FUNCTION: CALCULATE NIGHTS ---
    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const checkInTime = new Date(checkIn).getTime();
        const checkOutTime = new Date(checkOut).getTime();
        if (checkOutTime <= checkInTime) return 0;

        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((checkOutTime - checkInTime) / oneDay));
        return diffDays;
    }

    // --- API CALLS ---

    // 1. Fetch Room Details
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`);
                if (response.data.success) {
                    const fetchedRoom = response.data.room;
                    setRoom(fetchedRoom);
                    // Use the single image string as the main image
                    setMainImage(fetchedRoom.image);
                }
            } catch (error) {
                console.error("Error fetching room details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRoom();
    }, [id]);

    // 2. Check Availability & Price (Triggers on date change)
    useEffect(() => {
        if (!room || !formData.checkInDate || !formData.checkOutDate) {
            setIsAvailable(false);
            setTotalPrice(0);
            return;
        }

        const checkAvailabilityAndPrice = async () => {
            setIsChecking(true);
            setIsAvailable(false);

            const nights = calculateNights(formData.checkInDate, formData.checkOutDate);
            if (nights === 0) { setIsChecking(false); return; }

            try {
                const checkResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/check`, {
                    roomId: room._id,
                    checkInDate: formData.checkInDate,
                    checkOutDate: formData.checkOutDate
                });

                if (checkResponse.data.success) {
                    const calculatedTotal = nights * (room.price || 0);
                    setTotalPrice(calculatedTotal);
                    setIsAvailable(true);
                } else {
                    alert(checkResponse.data.message);
                    setTotalPrice(0);
                    setIsAvailable(false);
                }

            } catch (error) {
                console.error("Availability check failed:", error);
            } finally {
                setIsChecking(false);
            }
        };
        checkAvailabilityAndPrice();
    }, [formData.checkInDate, formData.checkOutDate, room]);


    // 3. Final Submission: CREATE BOOKING
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!isAvailable || totalPrice === 0) return alert("Please check availability and ensure dates are valid.");

        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate('/login');

            const bookingResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings/create`, {
                roomId: room._id,
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                guests: formData.guests,
                roomPrice: room.price,
                totalPrice: totalPrice
            }, {
                headers: { token }
            });

            if (bookingResponse.data.success) {
                alert(`Booking Successful! Total Price: ₹${totalPrice}. Status: Payment Pending.`);
                navigate('/my-bookings');
            } else {
                alert(bookingResponse.data.message);
            }

        } catch (error) {
            alert("Booking failed. Please try again.");
            console.error("Booking submission error:", error);
        }
    };


    // --- RENDER LOGIC ---
    if (loading) return <div className='pt-32 text-center'>Loading details...</div>
    if (!room) return <div className='pt-32 text-center'>Room not found.</div>

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>

            {/* Room Details Header */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>
                    {room.name} <span className='font-inter text-sm'>at {room.hotelName})</span>
                </h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>
                    Best Seller
                </p>
            </div>

            {/* Room Rating and Address */}
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
            </div>
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.address}</span>
            </div>

            {/* Room Images - Main Image Only (Fixes Duplication) */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-full w-full'>
                    <img src={mainImage} alt="Room Main Image"
                        className='w-full h-[400px] object-cover rounded-xl shadow-lg' />
                </div>
            </div>

            {/* Room Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2
                            rounded-lg bg-gray-100'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ORIGINAL STATIC PRICE BOX - REMOVED TO PREVENT DUPLICATION */}
                {/* <p className='text-2xl font-medium'>₹{room.price}/night</p> */}
            </div>

            {/* --- CHECKIN CHECKOUT & BOOKING FORM --- */}
            <form onSubmit={handleBookingSubmit}
                className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>

                {/* Input Fields */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                    {/* Check-In */}
                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
                        <input type="date" id='checkInDate' min={today}
                            value={formData.checkInDate}
                            onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>
                    {/* Divider */}
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    {/* Check-Out */}
                    <div className='flex flex-col'>
                        <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
                        <input type="date" id='checkOutDate'
                            min={formData.checkInDate || today}
                            value={formData.checkOutDate}
                            onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>
                    {/* Divider */}
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    {/* Guests */}
                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='font-medium'>Guests</label>
                        <input type="number" id='guests' min="1" max={room.capacity}
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>
                </div>

                {/* Price Display & Button (New Integrated Box) */}
                <div className='flex flex-col items-end max-md:w-full max-md:mt-6'>
                    {totalPrice > 0 && !isChecking && (
                        <p className={`text-2xl font-bold mb-3 ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                            ₹{totalPrice} Total
                        </p>
                    )}
                    <button
                        type='submit'
                        disabled={!isAvailable || isChecking || totalPrice === 0}
                        className={`transition-all text-white rounded-md max-md:w-full md:px-16 py-3 md:py-4 text-base cursor-pointer ${!isAvailable || isChecking || totalPrice === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2563eb] hover:bg-[#1e40af]'
                            }`}
                    >
                        {isChecking ? "Checking..." : isAvailable ? "BOOK NOW" : "Unavailable / Select Dates"}
                    </button>
                </div>
            </form>

            {/* common specifications - Use original map logic */}
            <div className='mt-25 space-y-4'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>Guests will be allocated on the ground floor according to availability...</p>
            </div>

            {/* hosted by - Conceptual Owner details are omitted as we don't fetch owner data */}
            <div className='flex flex-col items-start gap-4'>
                <div className='flex gap-4'>
                    {/* Placeholder image for host */}
                    <img src={assets.profile_icon || 'https://via.placeholder.com/60'} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
                    <div>
                        <p className='text-lg md:text-xl'>Hosted by {room.hotelName}</p>
                        <div className='flex items-center mt-1'>
                            <StarRating />
                            <p className='ml-2'>200+ reviews</p>
                        </div>
                    </div>
                </div>
                <button className='px-6 py-2.5 mt-4 rounded text-white bg-[#2563eb] hover:bg-[#1e40af] transition-all cursor-pointer'>Contact Now</button>
            </div>
        </div>
    )
}
export default RoomDetails