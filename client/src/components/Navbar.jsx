import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // <--- IMPORT useLocation
import { assets } from "../assets/assets";

const Navbar = ({ setShowLogin, user, setUser, logout }) => {

    const navigate = useNavigate();
    const location = useLocation(); // <--- Initialize useLocation

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- LOGIC: Determines Main Button Path ---
    const isLoggedIn = !!user;
    const isOwner = user?.role === 'hotelOwner';
    const dashboardPath = '/my-bookings';
    const dashboardLabel = 'Dashboard';
    // ------------------------------------------

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // --- NEW VISIBILITY LOGIC ---
    // Background should be solid if (scrolled) OR if (not on the home page)
    const isSolidBackground = isScrolled || location.pathname !== '/';

    // Apply styling based on isSolidBackground
    const backgroundClass = isSolidBackground ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6";
    const textColorClass = isSolidBackground ? "text-gray-700" : "text-white";
    const linkColorClass = isSolidBackground ? "bg-gray-700" : "bg-white"; // For the underline/separator
    const buttonTextColor = isSolidBackground ? 'text-black' : 'text-white';
    // --- END NEW VISIBILITY LOGIC ---


    // NOTE: Logout function is now passed down from App.jsx

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-40 ${backgroundClass}`}>

            {/* Logo */}
            <Link to="/">
                <img src={assets.logo} alt="logo" className={`h-9 ${isSolidBackground && "invert opacity-80"}`} />
            </Link>

            {/* Desktop Nav */}
            <div className={`hidden md:flex items-center gap-4 lg:gap-8 ${textColorClass}`}> {/* Applying main text color */}
                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${textColorClass}`}>
                        {link.name}
                        <div className={`${linkColorClass} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </a>
                ))}

                {/* --- SMART DASHBOARD BUTTON (Desktop) --- */}
                {isLoggedIn && (
                    <Link to={dashboardPath}>
                        <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all ${buttonTextColor}`}>
                            {dashboardLabel}
                        </button>
                    </Link>
                )}
                {/* --- END SMART BUTTON --- */}
            </div>

            {/* Desktop Right Side (Search + Login/Avatar) */}
            <div className="hidden md:flex items-center gap-4">

                {!user ? (
                    <button
                        onClick={() => setShowLogin(true)}
                        className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer ${isSolidBackground ? "text-white bg-black" : "bg-white text-black"}`}
                    >
                        Login
                    </button>
                ) : (
                    <div className='group relative ml-4'>
                        {/* User Avatar (using image from DB or default) */}
                        <img src={user.image || assets.profile_icon} alt="" className='w-10 h-10 rounded-full cursor-pointer object-cover border-2 border-white/50' />

                        {/* --- DROPDOWN MENU --- */}
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-xl border border-gray-100'>

                                {/* ADMIN PANEL LINK (Owner Only) */}
                                {isOwner && (
                                    <Link to="/owner">
                                        <p className='cursor-pointer hover:text-black font-medium text-blue-600'>
                                            Admin Panel
                                        </p>
                                    </Link>
                                )}

                                <Link to="/my-bookings">
                                    <p className='cursor-pointer hover:text-black font-medium'>My Profile</p>
                                </Link>

                                <p onClick={logout} className='cursor-pointer hover:text-red-500 font-medium'>Logout</p>
                            </div>
                        </div>
                        {/* --- END DROPDOWN MENU --- */}
                    </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {/* Show Avatar on mobile navbar if logged in */}
                {user && <img src={user.image} className="w-8 h-8 rounded-full object-cover" />}

                <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={assets.menuIcon} alt="menu" className={`${isScrolled && 'invert'} h-6 cursor-pointer`} />
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
                </button>

                {navLinks.map((link, i) => (
                    <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </a>
                ))}

                {/* --- SMART DASHBOARD BUTTON (Mobile) --- */}
                {isLoggedIn ? (
                    <>
                        <Link to={dashboardPath}>
                            <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                                {dashboardLabel}
                            </button>
                        </Link>

                        {isOwner && ( // NEW: ADMIN PANEL LINK MOBILE
                            <Link to="/owner" onClick={() => setIsMenuOpen(false)} >
                                <p className='text-blue-600 font-bold'>Admin Panel</p>
                            </Link>
                        )}

                        <button onClick={logout} className="text-red-500 font-bold">
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => {
                            setIsMenuOpen(false);
                            setShowLogin(true);
                        }}
                        className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
                    >
                        Login
                    </button>
                )}
                {/* --- END SMART BUTTON --- */}
            </div>
        </nav>
    );
}

export default Navbar;