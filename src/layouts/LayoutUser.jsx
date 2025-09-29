// // src/layouts/LayoutUser.jsx
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Outlet } from "react-router-dom";

// export default function LayoutUser() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* ✅ Header user */}
//       <Header mode="user" />

//       {/* ✅ Nội dung chính */}
//       <main
//         className="
//           flex-1 
//           mt-16 sm:mt-20 lg:mt-24  // 👈 chừa khoảng cho header cố định
//           px-4 sm:px-6 lg:px-8     // 👈 padding ngang responsive
//           w-full
//         "
//       >
//         <Outlet />
//       </main>

//       {/* ✅ Footer */}
//       <Footer />
//     </div>
//   );
// }
// src/layouts/LayoutUser.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function LayoutUser() {
  // ✅ Đồng bộ giống LayoutAdmin, nhưng thay vì Menu dùng navLinks
  const navLinks = [
    { key: "home", to: "/user/home", label: "Trang chủ" },
    { key: "movies", to: "/user/movies", label: "Phim" },
    { key: "account", to: "/user/account", label: "Tài khoản" },
    { key: "contact", to: "/", label: "Liên hệ" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Header user nhận navLinks */}
      <Header mode="user" navLinks={navLinks} />

      {/* ✅ Nội dung chính */}
      <main
        className="
          flex-1 
          mt-16 sm:mt-20 lg:mt-24
          px-4 sm:px-6 lg:px-8 
          w-full
        "
      >
        <Outlet />
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
