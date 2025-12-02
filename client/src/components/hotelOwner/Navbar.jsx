import React from 'react'
import { Link, useLocation } from 'react-router-dom' // <--- IMPORT useLocation
import { assets } from '../../assets/assets'

// Accept the user and logout function as props
const Navbar = ({ user, logout }) => {

    // Check current path to determine link destination
    const location = useLocation();
    const isOnDashboard = location.pathname.includes('/owner');

    // Dynamically set the link path and label
    const linkPath = isOnDashboard ? '/' : '/owner';
    const linkLabel = isOnDashboard ? 'Back Home' : 'Dashboard Panel';

    const username = user?.username || "Owner Profile";
    const userImage = user?.image || assets.default_profile_icon;

    return (
        <div className='flex items-center justify-between px-4 md:px-8
        border-b border-gray-300 py-3 bg-white transition-all
        duration-300'>
            <Link to='/'>
                <img src={assets.logo} alt="logo" className='h-9 invert
                opacity-80'/>
            </Link>

            <div className='flex items-center space-x-6'>
                {/* --- REAL USER DISPLAY WITH DROPDOWN --- */}
                <div className="relative group cursor-pointer">
                    {/* Profile Click Area */}
                    <div className="flex items-center gap-3">
                        <p className='text-gray-800 text-sm font-medium hidden sm:block'>
                            {username}
                        </p>
                        <img
                            src={userImage}
                            alt="Owner Avatar"
                            className="h-8 w-8 rounded-full object-cover border border-gray-300"
                        />
                    </div>
                    {/* Dropdown Menu - Hidden until hover */}
                    <div className="absolute right-0 top-full hidden group-hover:block pt-2">
                        <div className="w-36 bg-white border border-gray-200 rounded-md shadow-lg py-1">

                            {/* FIX: CONDITIONAL NAVIGATION LINK */}
                            <Link to={linkPath} className="block">
                                <p className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 cursor-pointer">
                                    {linkLabel} {/* Displays 'Back Home' or 'Dashboard Panel' */}
                                </p>
                            </Link>

                            <div className='border-t border-gray-200 my-1'></div>

                            {/* Existing: Logout Link */}
                            <p
                                onClick={logout}
                                className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                            >
                                Logout
                            </p>
                        </div>
                    </div>
                </div>
                {/* --- END REAL USER DISPLAY --- */}
            </div>
        </div>
    )
}

export default Navbar