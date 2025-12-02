import React, { useState } from 'react';
import axios from 'axios'; // <--- Import Axios
import { assets } from '../assets/assets';

const LoginPopup = ({ setShowLogin, setUser }) => {

    const [currState, setCurrState] = useState("Login");

    // State for form data
    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault();

        // Base URL of your backend
        let newUrl = `${import.meta.env.VITE_API_URL}/api`;

        if (currState === "Login") {
            newUrl += "/login";
        } else {
            newUrl += "/signup";
        }

        try {
            // API CALL
            const response = await axios.post(newUrl, data);

            if (response.data.success) {
                // 1. Set the Token in LocalStorage
                localStorage.setItem("token", response.data.token);

                localStorage.setItem("user", JSON.stringify(response.data.user));

                // 2. Set the User in State (so Navbar updates instantly)
                setUser(response.data.user);

                // 3. Close the modal
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }

        } catch (error) {
            // Handle Errors (like "User already exists" or "Wrong password")
            console.error(error);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="absolute z-50 w-full h-full bg-black/50 grid place-items-center top-0 left-0 backdrop-blur-sm">
            <form onSubmit={onLogin} className="bg-white p-8 rounded-xl w-[max(23vw,330px)] flex flex-col gap-5 shadow-lg">

                <div className="flex justify-between items-center text-black">
                    <h2 className="text-2xl font-bold">{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className="w-4 cursor-pointer" />
                </div>

                <div className="flex flex-col gap-4">
                    {currState === "Sign Up" && (
                        <input
                            name='username' // <--- MUST MATCH BACKEND "username"
                            onChange={onChangeHandler}
                            value={data.username}
                            type="text"
                            placeholder="Your Name"
                            required

                            className="outline-none border border-gray-300 p-2 rounded-md focus:border-black"
                        />
                    )}
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder="Your Email"
                        required
                        autoComplete='email'
                        className="outline-none border border-gray-300 p-2 rounded-md focus:border-black"
                    />
                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder="Password"
                        required
                        autoComplete='current-password'
                        className="outline-none border border-gray-300 p-2 rounded-md focus:border-black"
                    />
                </div>

                <button type="submit" className="bg-black text-white p-2 rounded-md font-medium cursor-pointer">
                    {currState === "Sign Up" ? "Create account" : "Login"}
                </button>

                <div className="text-sm text-gray-500">
                    {currState === "Login" ? (
                        <p>Create a new account? <span onClick={() => setCurrState("Sign Up")} className="text-black font-bold cursor-pointer hover:underline">Click here</span></p>
                    ) : (
                        <p>Already have an account? <span onClick={() => setCurrState("Login")} className="text-black font-bold cursor-pointer hover:underline">Login here</span></p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginPopup;