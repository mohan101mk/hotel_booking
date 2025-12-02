import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cities, assets } from '../assets/assets';

const Hero = () => {
    const navigate = useNavigate();

    // State to hold form data
    const [formData, setFormData] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        guests: 0
    });

    // Universal change handler for all inputs
    const onChangeHandler = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handler for form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // 1. Build Query String (Only append filled fields)
        const params = new URLSearchParams();
        if (formData.destination) params.append('city', formData.destination);
        if (formData.checkIn) params.append('checkIn', formData.checkIn);
        if (formData.checkOut) params.append('checkOut', formData.checkOut);
        if (formData.guests) params.append('capacity', formData.guests);

        // 2. Redirect to the AllRooms page with the filters applied
        navigate(`/rooms?${params.toString()}`);
    };

    return (
        // --- CENTERED CONTAINER ---
        <div className='flex flex-col items-center justify-center
         px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] 
         bg-no-repeat bg-cover bg-center h-screen text-center'>

            {/* --- ATTRACTIVE CONTENT --- */}
            <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>
                Luxury Redefined</p>

            {/* TEXT FIX: Added text-shadow for depth and changed color to a rich white/gold tone */}
            <h1 className='font-playfair text-3xl md:text-5xl md:text-[56px] md:leading-[60px] font-bold md:font-extrabold max-w-3xl mt-4 drop-shadow-lg' style={{ textShadow: '0 3px 5px rgba(0,0,0,0.4)' }}>
                Discover Your Perfect Gateway Destination</h1>

            {/* TEXT FIX: Slightly adjusted text color for better contrast */}
            <p className='max-w-130 mt-2 text-sm md:text-base text-gray-100' >
                Unmatched comfort, exclusive resorts. Your perfect journey begins with a single search.</p>

            {/* --- FUNCTIONAL SEARCH FORM --- */}
            <form onSubmit={handleSearchSubmit} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="destination">Destination</label>
                    </div>
                    <input list='destinations' id="destination" type="text"
                        onChange={onChangeHandler}
                        onBlur={onChangeHandler} // <--- ADD THIS LINE (Forces state update when focus leaves the input)
                        value={formData.destination}
                        className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                        placeholder="Type here"
                        required
                    />
                    <datalist id='destinations'>
                        {cities.map((city, index) => (
                            <option value={city} key={index} />
                        ))}

                    </datalist>
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkIn">Check in</label>
                    </div>
                    <input id="checkIn" type="date" onChange={onChangeHandler} value={formData.checkIn}
                        className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkOut">Check out</label>
                    </div>
                    <input id="checkOut" type="date" onChange={onChangeHandler} value={formData.checkOut}
                        className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                    <label htmlFor="guests">Guests</label>
                    <input min={1} max={4} id="guests" type="number" onChange={onChangeHandler} value={formData.guests}
                        className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
                </div>

                {/* BUTTON FIX: Changed to a deeper color for royal feel */}
                {/* --- Updated Submit Button --- */}
                <button type="submit" className="bg-indigo-700 text-white px-6 py-2 rounded-md transition-all hover:bg-indigo-800 max-md:w-full">
                    Check Availability
                </button>

            </form>
            {/* --- END FORM --- */}

        </div>

    )
}

export default Hero