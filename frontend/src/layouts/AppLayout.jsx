import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <Sidebar />
      <div className="min-h-screen lg:pl-72">
        <Navbar />
        <main className="px-4 pb-10 pt-5 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
