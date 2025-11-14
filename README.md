# 🏠 RentMate – Find Your Perfect Stay & List Your Space

RentMate is a full-stack web application built to simplify the process of **finding flatmates**, **exploring PGs/flats**, and **listing properties** for rent. It features secure authentication, verified owner access, AI-powered recommendations, and a modern UI.

---

## 🚀 Features

### 🔐 Authentication & Verification

* Secure login with **Auth0** (Google OAuth)
* Automatic user creation/update in backend
* **Multi-step verification system** for property owners
* Role-based access control (Owner / Flatmate)
* Auto-redirect to verification for unverified users

### 🏡 Property Listing (Owner-Only)

* 7-step, highly detailed listing wizard:

  * Property type & basic info
  * Location & nearby places
  * Property specifications
  * Amenities & house rules
  * Pricing & availability
  * Photos & media
  * Contact & publish
* Upload multiple photos (client-side preview)
* Publish or save as draft

### 👥 Flatmate Search

* Explore people looking for PG/flat
* Search by keywords & location
* Public profiles with social media links

### 🛏️ Find Your Stay

* Explore listed PGs/flats from verified owners

### 📊 Trust & Statistics

* Backend-generated trust metrics
* Verified users count
* Success rate & ratings

### 📨 Messaging & Future Scope

* Real-time chat (planned)
* Notifications (planned)

---

## 🛠️ Tech Stack

### Frontend

* **React + Vite**
* CSS Modules
* React Router
* Auth0 React SDK
* Lucide Icons
* Cloud Deployment: **GitHub Pages**

### Backend

* **Node.js + Express**
* MongoDB + Mongoose
* Axios for image proxying
* Render Deployment

---

## 📁 Project Structure

```
RentMate/
├── src/
│   ├── Auth/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   └── App.jsx
├── public/
├── package.json
└── vite.config.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in root:

```
VITE_AUTH0_DOMAIN=yourdomain.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
VITE_BACKEND_URL=https://your-backend-url.onrender.com/api
```

---

## ▶️ Running Locally

### 1. Clone the repo

```
git clone https://github.com/yourname/RentMate.git
cd RentMate
```

### 2. Install dependencies

```
npm install
```

### 3. Run development server

```
npm run dev
```

### 4. Build for production

```
npm run build
```

---

## 🧪 Backend API Endpoints

### 👤 User Routes

* `POST /user` – create/update user
* `GET /user/:auth0Id` – get user details
* `POST /user/:auth0Id/verification` – submit verification
* `GET /user/:auth0Id/owner-access` – check owner permissions
* `POST /user/:auth0Id/force-approval` – test approval
* `GET /user/:auth0Id/profile-image` – proxy Google images
* `GET /user/details/:userId` – public profile

### 🏡 Property Routes

* `POST /property/create` – create listing
* Additional browsing routes planned

---

## 🔒 Owner Access Logic

A user is considered **verified owner** only if:

* `userType` = PG_OWNER / FLAT_OWNER
* `verificationData` exists
* `verificationStatus` = APPROVED
* `isVerified = true`

---

## 🌐 Deployment

### Frontend

* Hosted on **GitHub Pages**
* Auto build using Vite

### Backend

* Hosted on **Render** (Node.js + MongoDB Atlas)

---

## 💡 Future Enhancements

* Real-time messaging
* Booking system
* Payment gateway
* Admin dashboard
* AI property ranking

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

---

## 📜 License

MIT License

---

If you want, I can also create **API Documentation**, **Flowcharts**, **ER Diagram**, or a **professional GitHub README with badges**.
