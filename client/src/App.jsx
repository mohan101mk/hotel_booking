import React, { useState, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom' // <--- IMPORTED useNavigate

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginPopup from './components/LoginPopup'
import OwnerRoute from './components/OwnerRoute'

// Pages
import Home from './pages/Home'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'

// Owner Pages
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRooms'
import EditRoom from './pages/hotelOwner/EditRoom'

const App = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // 1. STATE MANAGEMENT
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  // 2. LOADING STATE (Fixes the "Refresh kicks you out" bug)
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGOUT FUNCTION DEFINITION (Used by both Navbars) ---
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // Redirect to home after clearing state
  }
  // --------------------------------------------------------

  // 3. CHECK LOCAL STORAGE ON LOAD
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    // Stop loading after we check storage
    setIsLoading(false);
  }, []);

  const location = useLocation();
  const isOwnerPath = location.pathname.includes('/owner');

  // Prevent app from rendering until we know if user is logged in
  if (isLoading) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className='app'>
      {/* SHOW LOGIN POPUP CONDITIONALLY */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} setUser={setUser} />}

      {/* PASS LOGOUT PROP TO NAVBAR (Public Nav) */}
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} user={user} setUser={setUser} logout={logout} />}

      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />

          {/* --- PROTECTED OWNER ROUTES --- */}
          <Route
            path='/owner'
            element={
              <OwnerRoute user={user}>
                <Layout user={user} logout={logout} /> {/* <--- PASS LOGOUT TO LAYOUT */}
              </OwnerRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="edit-room/:id" element={<EditRoom />} />
          </Route>

        </Routes>
      </div>

      {/* Hide footer on owner pages */}
      {!isOwnerPath && <Footer />}
    </div>
  )
}

export default App