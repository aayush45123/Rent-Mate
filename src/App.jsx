import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import UserProfile from "./Pages/UserProfile/userProfile";
import Footer from "./components/Footer/Footer";
import Support from "./Pages/Support/Support";
import FlatmateSearch from "./Pages/FlatmateSearch/FlatmateSearch";
import VerificationForm from "./Pages/VerificationForm/verificationForm";
import ProtectedOwnerRoute from "./components/ProtectedRoute";
import ListYourSpace from "./Pages/ListYourSpace/ListYourSpace";
import FindYourStay from "./Pages/FindYourStay/FindYourStay";
import PropertyDetail from "./Pages/PropertyDetail/PropertyDetail";
import UserDetail from "./Pages/UserDetail/UserDetail";
import About from "./Pages/About/About";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<About />} />
        <Route path="/find-flatmates" element={<FlatmateSearch />} />
        <Route path="/find-your-stay" element={<FindYourStay />} />
        <Route
          path="/property-detail/:propertyId"
          element={<PropertyDetail />}
        />
        <Route path="/user/:userId" element={<UserDetail />} />{" "}
        <Route path="/flatmate-profile/:id" element={<PropertyDetail />} />
        <Route path="/verification-form" element={<VerificationForm />} />
        <Route
          path="/list-your-space"
          element={
            <ProtectedOwnerRoute>
              <ListYourSpace />
            </ProtectedOwnerRoute>
          }
        />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
