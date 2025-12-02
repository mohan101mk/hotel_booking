import React from 'react'
import { useNavigate } from 'react-router-dom'
// REMOVE: import { roomsDummyData } from '../assets/assets' <--- DELETE THIS LINE
import HotelCard from './HotelCard'
import Title from './Title'

// Accept the 'rooms' data passed from Home.jsx
const FeaturedDestination = ({ rooms }) => {
  const navigate = useNavigate();

  // Ensure rooms is an array and only show the first 4 (as per your original slicing logic)
  const roomsToDisplay = Array.isArray(rooms) ? rooms.slice(0, 4) : [];

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title title='Featured Destinations' subTitle='Explore our handpicked selection of top destinations for your next getaway.' />

      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {roomsToDisplay.map((room, index) => (
          // Use the real data coming from the database
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

      <button onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
        className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
        View all Destinations
      </button>
    </div>
  )
}

export default FeaturedDestination