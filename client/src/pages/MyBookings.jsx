import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import axios from 'axios';
// Removed: import { userBookingsDummyData } from '../assets/assets';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          // Optionally redirect to login here if not token
          return;
        }

        // Fetch bookings from protected API
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`, {
          headers: { token }
        });

        if (response.data.success) {
          setBookings(response.data.bookings);
        } else {
          // The API call succeeded but returned a logic error
          alert("Failed to load bookings: " + response.data.message);
        }
      } catch (error) {
        console.error("Fetch Bookings Error:", error);
        // Handle network or 500 errors
        alert("Could not load your bookings history due to a connection error.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []); // Run only once on mount

  // --- LOADING / EMPTY STATE RENDERING ---
  if (loading) {
    return <div className='py-28 md:pt-32 text-center'>Loading your reservations...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className='py-28 md:pt-32 px-4 text-center'>
        <Title title='My Bookings' subTitle='You have no past, current, or upcoming reservations.' align='center' />
        <p className='mt-10 text-lg text-gray-500'>Book your first room to see it here!</p>
      </div>
    );
  }


  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place.' align='left' />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        {/* Table Header */}
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
          <div className='w-1/3'>Hotels</div>
          <div className='w-1/3'>Date & Timings</div>
          <div className='w-1/3'>Payment</div>
        </div>

        {bookings.map((booking) => {
          // Determine status for UI (isPaid logic)
          const isPaid = booking.paymentStatus === 'Completed';
          const roomDetails = booking.roomId; // Use the populated room object

          return (
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>

              {/* ------ Hotel Details */}
              <div className='flex flex-col md:flex-row'>

                {/* IMAGE FIX: Use the populated room image field */}
                <img src={roomDetails.image} alt='hotel-img' className='min-md:w-44 rounded shadow object-cover h-24 w-24' />

                <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                  {/* NAME FIX: Use the populated room name and hotel name */}
                  <p className='font-playfair text-2xl'>
                    {roomDetails.name} <span className='font-inter text-sm'>at {roomDetails.hotelName}</span>
                  </p>

                  <div className='flex items-center gap-1 text-sm text-gray-500 '>
                    <img src={assets.locationIcon} alt='location-icon' />
                    <span>{roomDetails.address}</span>
                  </div>
                  <div className='flex items-center gap-1 text-smtext-gray-500 '>
                    <img src={assets.guestsIcon} alt='guests-icon' />
                    <span>Guests: {booking.guests}</span>
                  </div>
                  <p className='text-base'>Total: ₹{booking.totalPrice}</p>
                </div>
              </div>

              {/* date and timings */}
              <div className='flex flex-col  md:gap-12 mt-3 gap-8'>
                <div className='flex flex-col md:flex-row gap-8'>
                  <div>
                    <p>Check-In:</p>
                    <p className='text-gray-500 text-sm'>
                      {new Date(booking.checkInDate).toDateString()}
                    </p>
                  </div>
                  <div>
                    <p>Check-Out:</p>
                    <p className='text-gray-500 text-sm'>
                      {new Date(booking.checkOutDate).toDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* payment status */}
              <div className='flex flex-col items-start justify-center pt-3'>
                <div className='flex items-center gap-2'>
                  {/* PAYMENT STATUS FIX: Use isPaid boolean derived from paymentStatus string */}
                  <div className={`h-3 w-3 rounded-full ${isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                  <p className={`text-sm ${isPaid ? "text-green-500" : "text-red-500"}`}>
                    {booking.paymentStatus}
                  </p>
                </div>
                {!isPaid && (
                  <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400
                      rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;