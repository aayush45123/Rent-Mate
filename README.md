🏡 RentMate – Find Flatmates, PGs & List Your Space

A full-stack web platform where users can find flatmates, browse rentals, and verified property owners can list their PGs / flats / rooms with complete details.

🚀 Live Website: your GitHub Pages link
🖥️ Frontend: React + Vite + Auth0
⚙️ Backend: Node.js + Express + MongoDB (Render Deployment)

📌 Features
👥 User Features

Login / Signup using Auth0

Create and update profile

Search flatmates

Browse PGs, flats, shared rooms

View property details

Contact property owners (based on visibility settings)

🔐 Verification System

Users fill a verification form

Owners (PG Owner / Flat Owner) get Approved status

Only Verified Owners can:
✔ Access List Your Space page
✔ Create rental listings

🏠 Property Listing

Verified owners can create complete property listings with:

Property details (BHK, rooms, floors, size, age)

Location, area, map coordinates

Amenities & house rules

Pricing & availability

Photos, videos, and virtual tours

Contact information

🔎 Search System

Keyword search

Location-based filtering

Pagination for browsing flatmates

📸 Image Handling

Google profile image proxy (CORS fix)

Base64 fallback when image fetching fails

🛠️ Tech Stack
Frontend

React 18

Vite

React Router

Auth0

Context API

Lucide React Icons

CSS Modules

Backend

Node.js + Express

MongoDB + Mongoose

axios (image proxy)

Render Hosting

📂 Folder Structure
RentMate/
 ├── src/
 │   ├── Auth/
 │   ├── components/
 │   ├── context/
 │   ├── pages/
 │   ├── assets/
 │   └── styles/
 ├── backend/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   └── server.js
 ├── .env
 ├── package.json
 ├── README.md
 └── vite.config.js

⚙️ Environment Variables
Frontend (.env)
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_BACKEND_URL=https://your-backend-url.onrender.com/api

Backend (.env)
MONGO_URI=your-mongodb-connection
PORT=5000
NODE_ENV=production

🚀 How to Run Locally
📦 1. Clone the Repository
git clone https://github.com/yourusername/RentMate.git
cd RentMate

💻 2. Install frontend dependencies
npm install

▶ 3. Run frontend
npm run dev

🗄️ 4. Backend setup
cd backend
npm install
npm start

🔐 Auth Flow

User logs in through Auth0

Frontend automatically saves user to backend

Backend checks:

userType

verificationData

verificationStatus

If user is not verified → redirect to /verification-form

If user is PG_OWNER / FLAT_OWNER AND verified → grant access to protected routes

🔧 API Endpoints
User Routes
Method	Endpoint	Description
POST	/user	Create / update user
GET	/user/:auth0Id	Get user details
PUT	/user/:auth0Id/profile	Update profile
POST	/user/:auth0Id/verification	Submit verification
GET	/user/:auth0Id/owner-access	Check owner privilege
POST	/user/:auth0Id/force-approval	Testing: force approve
Flatmate Routes
Method	Endpoint
GET	/user/:auth0Id/search-flatmates
GET	/user/:auth0Id/flatmates
Image Proxy
GET /user/:auth0Id/profile-image

🧪 Key Features Implemented in Code
✔ Owner Access Logic

Backend checks:

userType = PG_OWNER / FLAT_OWNER

verificationData submitted

isVerified = true

verificationStatus = APPROVED

✔ Automatic Redirect

Middleware blocks protected pages for unverified users.

✔ Google Image Proxy

Backend fetches Google profile images → converts to base64 → prevents CORS failure.

🧑‍💻 Developer Notes

Use encodeURIComponent(user.sub) everywhere when sending Auth0 IDs.

GitHub Pages requires HashRouter (/#/route format).

Render backend may sleep on free tier → add a retry UI for slow responses.

📸 Screenshots (Add after deployment)

Home page

Find flatmates

Verification form

List your space steps

Property details page

⭐ Future Enhancements

Chat system between owner and tenant

AI-based flatmate matching

Razorpay integration for token advance

Admin panel for verification/approvals

🤝 Contributing

Pull requests are welcome.
For major changes, open an issue first to discuss.

📄 License

This project is licensed under the MIT License.
