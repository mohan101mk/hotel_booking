import React from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'

// Accept the user prop from App.jsx
const Layout = ({ user, logout }) => {
    return (
        <div className='flex flex-col h-screen'>
            {/* Pass user AND logout prop to Navbar */}
            <Navbar user={user} logout={logout} />
            <div className='flex h-full'>
                <Sidebar />
                <div className='flex-1 p-4 pt-10 md:px-10 h-full overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default Layout