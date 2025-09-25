// src/layouts/LayoutUser.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function LayoutUser() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
      // md:mt-100
        className="flex-1 container-fluid mt-6 sm:mt-8 " // 👈 thêm margin-top responsive
        style={{ maxWidth: "200000px" }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
