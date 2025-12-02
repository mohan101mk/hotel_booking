import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';

const EditRoom = () => {
    const { id } = useParams(); // Get room ID from the URL (used for fetching and updating)
    const navigate = useNavigate();

    // 1. STATE (Holds data for the form)
    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialImageUrl, setInitialImageUrl] = useState(''); // Stores the current image URL for display

    const [inputs, setInputs] = useState({
        hotelName: '', address: '', city: '', name: '', price: '',
        description: '', capacity: '', amenities: []
    });

    const availableAmenities = ['Free WiFi', 'Free Breakfast', 'Room Service', 'Mountain View', 'Pool Access', 'AC', 'Gym'];

    // --- HANDLERS ---
    const onChangeHandler = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAmenityChange = (amenity) => {
        setInputs(prev => {
            const current = prev.amenities;
            if (current.includes(amenity)) return { ...prev, amenities: current.filter(a => a !== amenity) };
            else return { ...prev, amenities: [...current, amenity] };
        });
    };

    // --- 2. FETCH DATA TO PRE-FILL FORM (New Logic) ---
    useEffect(() => {
        const fetchRoomData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return navigate('/login');

            try {
                // CALL 1: GET /api/rooms/edit/:id (Protected Route)
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/edit/${id}`, {
                    headers: { token }
                });

                if (response.data.success && response.data.room) {
                    const roomData = response.data.room;

                    // Pre-fill the form state with existing data
                    setInputs({
                        hotelName: roomData.hotelName,
                        address: roomData.address,
                        city: roomData.city,
                        name: roomData.name,
                        price: roomData.price,
                        description: roomData.description,
                        capacity: roomData.capacity,
                        amenities: roomData.amenities || [] // Ensure it's an array
                    });

                    // Save the existing image URL for display
                    setInitialImageUrl(roomData.image);
                }
            } catch (error) {
                alert("Error loading room details for edit.");
            } finally {
                setLoading(false);
            }
        };
        fetchRoomData();
    }, [id, navigate]);


    // --- 3. SUBMISSION HANDLER (Uses PUT Request) ---
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();

        // Append all text data
        Object.keys(inputs).forEach(key => {
            if (key !== 'amenities') {
                formData.append(key, inputs[key]);
            }
        });
        inputs.amenities.forEach(item => formData.append("amenities", item));

        // Append the NEW file if one was selected (or the old URL)
        const newImageFile = images[1];
        if (newImageFile) {
            // New file selected - send the file buffer
            formData.append("image", newImageFile);
        } else {
            // No new file selected - send the old URL so the backend knows what to keep
            formData.append("image", initialImageUrl);
        }

        try {
            const token = localStorage.getItem("token");

            // CALL 2: PUT /api/rooms/update/:id (Protected Route)
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/rooms/update/${id}`, formData, {
                headers: { token }
            });

            if (response.data.success) {
                alert("Room updated successfully!");
                navigate('/owner/list-room'); // Redirect to list view
            } else {
                alert(response.data.message);
            }

        } catch (error) {
            alert("Update failed. Please check network and server logs.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };


    // --- RENDER LOGIC ---
    if (loading) return <div className='pt-20 text-center'>Loading Room Data...</div>;


    return (
        <form onSubmit={onSubmitHandler} className='max-w-4xl'>
            <Title align='left' font='outfit' title={`Edit Room: ${inputs.name || id}`} subTitle='Update room details, pricing, and amenities.' />

            {/* --- IMAGES SECTION --- */}
            <p className='text-gray-800 mt-6 font-medium'>Upload Images (Leave blank to keep existing image)</p>
            <div className='flex gap-4 my-2 flex-wrap'>
                {[1, 2, 3, 4].map((key) => (
                    <label htmlFor={`roomImage${key}`} key={key} className='cursor-pointer'>
                        {/* Display existing image or new preview */}
                        <img className='w-24 h-24 object-cover rounded bg-gray-100 border'
                            src={images[key] ? URL.createObjectURL(images[key]) : (key === 1 ? initialImageUrl || assets.uploadArea : assets.uploadArea)}
                            alt="Room Image Preview" />
                        <input type="file" accept='image/*' id={`roomImage${key}`} hidden
                            onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
                    </label>
                ))}
            </div>

            {/* --- HOTEL DETAILS --- */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
                <div>
                    <p className='text-gray-800'>Hotel Name</p>
                    <input name="hotelName" type="text" placeholder='e.g. Roomin Resort' className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.hotelName} onChange={onChangeHandler} required />
                </div>
                <div>
                    <p className='text-gray-800'>City</p>
                    <input name="city" type="text" placeholder='e.g. Mumbai' className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.city} onChange={onChangeHandler} required />
                </div>
                <div className='sm:col-span-2'>
                    <p className='text-gray-800'>Address</p>
                    <input name="address" type="text" placeholder='Full Address' className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.address} onChange={onChangeHandler} required />
                </div>
            </div>

            {/* --- ROOM DETAILS --- */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4'>
                <div className='flex-1'>
                    <p className='text-gray-800'>Room Name</p>
                    <input name="name" type="text" placeholder='e.g. Deluxe Suite' className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.name} onChange={onChangeHandler} required />
                </div>
                <div>
                    <p className='text-gray-800'>Price <span className='text-xs'>/night</span></p>
                    <input name="price" type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.price} onChange={onChangeHandler} required />
                </div>
                <div>
                    <p className='text-gray-800'>Capacity</p>
                    <input name="capacity" type="number" placeholder='2' className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.capacity} onChange={onChangeHandler} required />
                </div>
            </div>

            <div className='mt-4'>
                <p className='text-gray-800'>Description</p>
                <textarea name="description" rows={4} placeholder='Describe the room...' className='border border-gray-300 mt-1 rounded p-2 w-full'
                    value={inputs.description} onChange={onChangeHandler} required />
            </div>

            {/* --- AMENITIES --- */}
            <p className='text-gray-800 mt-4 font-medium'>Amenities</p>
            <div className='flex flex-wrap gap-3 mt-2'>
                {availableAmenities.map((amenity, index) => (
                    <div key={index} className='flex items-center gap-2 border px-3 py-1 rounded cursor-pointer hover:bg-gray-50'>
                        <input type="checkbox" id={`amenity${index}`}
                            checked={inputs.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)} />
                        <label htmlFor={`amenity${index}`} className='cursor-pointer text-sm text-gray-700'>{amenity}</label>
                    </div>
                ))}
            </div>

            <button type="submit" disabled={isSubmitting} className={`text-white px-8 py-3 rounded mt-8 cursor-pointer font-medium transition ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isSubmitting ? "UPDATING..." : "SAVE CHANGES"}
            </button>
        </form>
    )
}

export default EditRoom