 > RoomIn – Online Hotel Booking System


> Project Overview
RoomIn is an efficient, secure, and fully functional online hotel booking system designed to streamline the booking process for users and hotel owners alike.
The system prioritizes transparency, speed, and secure management of listings and bookings.

---

> Problem Statement
RoomIn solves the complexity and lack of transparency found in traditional systems by providing:
* A clean, intuitive interface for booking rooms.
* Role-Based Access Control (RBAC):** Separate experiences for Customers (`user`) and Hotel Owners (`hotelOwner`).
* Secure authentication and efficient management of listings and bookings.

---

> System Architecture
The final system utilizes a modern **Monorepo** structure, ensuring fast development and deployment.

 Layer        |       Technology          |           Notes 

*Frontend           React.js / Vite               Optimized for speed and responsiveness. 
*Backend            Node.js / Express.js          Consolidated controller logic for CRUD and Booking. 
*Database**         MongoDB Atlas                 Non-relational storage for flexibility.
*Authenticatio     JWT + bcrypt                  Secure Email/Password login. 
*Image Hosting     Cloudinary                    Handles all room image uploads and storage. 
---

> Final Key Features

 Category                              |                        Features Implemented 

*Authentication & Authorization                   Secure JWT sessions; Role-based access (User / Hotel Owner); Owner Dashboard protection. 
*Room CRUD Operations                             Hotel owners can **Create, Read, Update, and Delete** room listings via a protected dashboard. 
*Booking Logic                                    Functional **Availability Check(date overlap query) and Booking Record Creation** (Payment Pending status).
*User Management                                  Authenticated users can view their full booking history on `/my-bookings`. 
*UI Polish                                        Responsive Navbar with contextual styling (scroll/path), functional search bar, and clean Admin Panel UX. 

---

Final API Overview (Working Endpoints)
 
| Endpoint                        |       Method      |        Description                                              |           Access 

| `/api/login`                    |       POST        | Authenticate user/owner and issue JWT.                          |           Public 
| `/api/signup`                   |       POST        | Register a new user.                                            |           Public 
| `/api/rooms/all-rooms`          |       GET         | Fetch all available room listings for the public view.          |           Public 
| `/api/rooms/:id`                |       GET         | Fetch single room details.                                      |           Public 
| `/api/rooms/add-room`           |       POST        | Create** a new room listing (with Multer/Cloudinary upload).    |           Owner Only 
| `/api/rooms/update/:id`         |       PUT         | Update an existing room listing.                                |           Owner Only 
| `/api/rooms/delete/:id`         |       DELETE      | Delete a specific room listing.                                 |           Owner Only 
| `/api/bookings/check`           |       POST        | Check room availability for given dates (no token needed).      |           Public 
| `/api/bookings/create`          |       POST        | Create a new booking record.                                    |           Authenticated 
| `/api/bookings/my-bookings`     |       GET         | Get all bookings for the logged-in user.                        |           Authenticated 
| `/api/bookings/dashboard-stats` |       GET         | Aggregate total bookings and revenue for the owner's dashboard. |           Owner Only 

---


## 🔗 Deployment Links

 Service                    | Hosting Platform                  |    Live URL 

|Frontend                  | Vercel / Netlify                   | https://hotel-booking-6r6b.onrender.com
|   Backend**              | Render / Railway                   | https://hotel-booking-teal-phi.vercel.app/
|   Database**             | MongoDB Atlas                      | (Not publicly accessible) 
|   GitHub Repository**    | Github                             | https://github.com/mohan101mk/hotel_booking.git 
