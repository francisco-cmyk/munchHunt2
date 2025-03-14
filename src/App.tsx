import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Location from "./Pages/Location";
import Layout from "./Pages/Layout";
import "@animxyz/core";
import { MunchProvider } from "./Context/MunchContext";
import SelectionPage from "./Pages/SelectionPage";
import FoodList from "./Pages/FoodList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeProvider } from "./Context/DarkModeProvider";

export default function App() {
  return (
    <DarkModeProvider>
      <MunchProvider>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
        />
        <Router>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Location />} />
              <Route path='select' element={<SelectionPage />} />
              <Route path='restaurants' element={<FoodList />} />
            </Route>
          </Routes>
        </Router>
      </MunchProvider>
    </DarkModeProvider>
  );
}
