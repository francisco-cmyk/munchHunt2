import { Outlet } from "react-router-dom";
import "./index.css";

export default function Layout() {
  return (
    <div className='max-h-screen flex flex-col font-inter '>
      {/* Header or Navigation */}
      {/* <header className=" text-white py-4">
    </header> */}

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      {/* <footer className="bg-white-800 text-black py-4 text-center">
      <p>&copy; 2024 My App. All rights reserved.</p>
    </footer> */}
    </div>
  );
}
