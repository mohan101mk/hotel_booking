import React from 'react';
import { Navigate } from 'react-router-dom';

const OwnerRoute = ({ user, children }) => {

    // --- DEBUGGING LOGS ---
    console.log("--- OWNER ROUTE CHECK ---");
    console.log("Current User:", user);
    console.log("User Role:", user?.role);
    // ----------------------

    if (!user) {
        console.log("Result: Kicked out (No User)");
        return <Navigate to="/" replace />;
    }

    if (user.role !== 'hotelOwner') {
        console.log(`Result: Kicked out (Role is '${user.role}', needed 'hotelOwner')`);
        return <Navigate to="/" replace />;
    }

    console.log("Result: Access Granted!");
    return children;
};

export default OwnerRoute;