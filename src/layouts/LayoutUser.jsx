// src/layouts/LayoutUser.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function LayoutUser() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-fill container-fluid" style={{ maxWidth: "2000px" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
