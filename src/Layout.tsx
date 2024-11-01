import { Outlet } from "react-router-dom";
import "./index.css";

export default function Layout() {
  return (
    <div className='max-h-screen flex flex-col font-inter'>
      {/* Header or Navigation */}
      {/* <header className="bg-gray-800 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My App</h1>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
          <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
          <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
        </ul>
      </nav>
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
