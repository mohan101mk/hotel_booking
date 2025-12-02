import React, { useState, useEffect } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets'; // Assuming dummy data is no longer needed
import axios from 'axios';

const Dashboard = () => {

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return setLoading(false); // Can't fetch data if not logged in

            try {
                // Fetch stats from the protected API endpoint
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/dashboard-stats`, {
                    headers: { token }
                });

                if (response.data.success) {
                    const data = response.data.data;
                    setDashboardData({
                        totalBookings: data.stats.totalBookings,
                        totalRevenue: data.stats.totalRevenue.toFixed(2), // Format revenue to 2 decimal places
                        recentBookings: data.recentBookings // Populated booking details
                    });
                }
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Show loading state while fetching data
    if (loading) return <div className='pt-20 text-center'>Loading Owner Dashboard Data...</div>;

    return (
        <div>
            <Title align='left' font='outfit' title='Dashboard' subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations.' />

            <div className='flex gap-4 my-8'>
                {/* ---Total Bookings-- */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Bookings</p>
                        {/* Data: Use fetched totalBookings */}
                        <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                    </div>
                </div>
                {/* -------Total Revenue-- */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Total Revenue</p>
                        {/* Data: Use fetched totalRevenue */}
                        <p className='text-neutral-400 text-base'>₹ {dashboardData.totalRevenue}</p>
                    </div>
                </div>
            </div>

            {/* recent bookings table */}
            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
            <div className='w-full max-w-3x1 text-left border border-gray-300 rounded-1g max-h-80 overflow-y-scroll'>

                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Payment Status</th>
                        </tr>
                    </thead>

                    <tbody className='text-sm'>
                        {/* --- DYNAMIC DATA MAPPING --- */}
                        {dashboardData.recentBookings.map((item, index) => (
                            <tr key={index}>
                                {/* User Name: Populated from userId */}
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.userId.username}
                                </td>

                                {/* Room Name: Populated from roomId */}
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden' >
                                    {item.roomId.name}
                                </td>

                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 '>
                                    ₹ {item.totalPrice}
                                </td>

                                {/* Status Check: Now uses the paymentStatus string */}
                                <td className='py-3 px-4 border-t border-gray-300'>
                                    <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.paymentStatus === 'Completed' ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-600'}`}>
                                        {item.paymentStatus}
                                    </button>
                                </td>

                            </tr>
                        ))}
                        {/* --- END DYNAMIC DATA MAPPING --- */}
                    </tbody>
                </table>
            </div>

            {dashboardData.recentBookings.length === 0 && !loading && (
                <p className='text-center py-5 text-gray-500'>No recent bookings found.</p>
            )}
        </div>
    )
}

export default Dashboard