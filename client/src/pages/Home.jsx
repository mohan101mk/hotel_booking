import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination' // We will pass data here
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial'

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Public API: No token needed
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/all-rooms`);
        if (response.data.success) {
          setRooms(response.data.rooms);
        }
      } catch (error) {
        console.error("Error fetching public rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return <div className="text-center py-20">Loading Featured Rooms...</div>;

  return (
    <>
      <Hero />

      {/* ⚠️ FeaturedDestination MUST be updated to accept and display this data */}
      <FeaturedDestination rooms={rooms.slice(0, 4)} />

      <ExclusiveOffers />
      <Testimonial />
    </>
  )
}

export default Home;