import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import axios from 'axios'

const AddRoom = () => {
    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [loading, setLoading] = useState(false); // <--- New Loading State

    const [inputs, setInputs] = useState({
        hotelName: '', address: '', city: '', name: '', price: '',
        description: '', capacity: '', amenities: []
    })

    const availableAmenities = ['Free WiFi', 'Free Breakfast', 'Room Service', 'Mountain View', 'Pool Access', 'AC', 'Gym'];

    const onChangeHandler = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleAmenityChange = (amenity) => {
        setInputs(prev => {
            const current = prev.amenities;
            if (current.includes(amenity)) return { ...prev, amenities: current.filter(a => a !== amenity) }
            else return { ...prev, amenities: [...current, amenity] }
        })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true); // Start Loading

        const formData = new FormData();
        formData.append("hotelName", inputs.hotelName);
        formData.append("address", inputs.address);
        formData.append("city", inputs.city);
        formData.append("name", inputs.name);
        formData.append("price", Number(inputs.price));
        formData.append("description", inputs.description);
        formData.append("capacity", Number(inputs.capacity));

        inputs.amenities.forEach(item => formData.append("amenities", item));

        if (images[1]) formData.append("image", images[1]);
        else {
            setLoading(false);
            return alert("Please upload the first image");
        }

        try {
            const token = localStorage.getItem("token");
            // ⚠️ MAKE SURE PORT IS 5001
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/rooms/add-room`, formData, {
                headers: { token }
            });

            if (response.data.success) {
                alert("Room Added Successfully!");
                setInputs({ hotelName: '', address: '', city: '', name: '', price: '', description: '', capacity: '', amenities: [] });
                setImages({ 1: null, 2: null, 3: null, 4: null });
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false); // Stop Loading
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='max-w-4xl'>
            <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details for your listing.' />

            <p className='text-gray-800 mt-6 font-medium'>Upload Images (Cover Image First)</p>
            <div className='flex gap-4 my-2 flex-wrap'>
                {[1, 2, 3, 4].map((key) => (
                    <label htmlFor={`roomImage${key}`} key={key} className='cursor-pointer'>
                        <img className='w-24 h-24 object-cover rounded bg-gray-100 border'
                            src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
                        <input type="file" accept='image/*' id={`roomImage${key}`} hidden
                            onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
                    </label>
                ))}
            </div>

            {/* Inputs Section */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
                <div>
                    <p className='text-gray-800'>Hotel Name</p>
                    <input name="hotelName" type="text" className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.hotelName} onChange={onChangeHandler} required />
                </div>
                <div>
                    <p className='text-gray-800'>City</p>
                    <input name="city" type="text" className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.city} onChange={onChangeHandler} required />
                </div>
                <div className='sm:col-span-2'>
                    <p className='text-gray-800'>Address</p>
                    <input name="address" type="text" className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.address} onChange={onChangeHandler} required />
                </div>
            </div>

            <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4'>
                <div className='flex-1'>
                    <p className='text-gray-800'>Room Name</p>
                    <input name="name" type="text" className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.name} onChange={onChangeHandler} required />
                </div>
                <div>
                    <p className='text-gray-800'>Price</p>
                    <input name="price" type="number" className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.price} onChange={onChangeHandler} required />
                </div>
                <div>
                    <p className='text-gray-800'>Capacity</p>
                    <input name="capacity" type="number" className='border border-gray-300 mt-1 rounded p-2 w-full'
                        value={inputs.capacity} onChange={onChangeHandler} required />
                </div>
            </div>

            <div className='mt-4'>
                <p className='text-gray-800'>Description</p>
                <textarea name="description" rows={4} className='border border-gray-300 mt-1 rounded p-2 w-full'
                    value={inputs.description} onChange={onChangeHandler} required />
            </div>

            <p className='text-gray-800 mt-4 font-medium'>Amenities</p>
            <div className='flex flex-wrap gap-3 mt-2'>
                {availableAmenities.map((amenity, index) => (
                    <div key={index} className='flex items-center gap-2 border px-3 py-1 rounded cursor-pointer hover:bg-gray-50'>
                        <input type="checkbox" checked={inputs.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} />
                        <label className='cursor-pointer text-sm text-gray-700'>{amenity}</label>
                    </div>
                ))}
            </div>

            <button type="submit" disabled={loading} className={`${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-3 rounded mt-8 cursor-pointer font-medium transition`}>
                {loading ? "Adding..." : "ADD ROOM"}
            </button>
        </form>
    )
}

export default AddRoom