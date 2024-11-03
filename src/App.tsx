import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Layout from "./Pages/Layout";
import "@animxyz/core";
import { MunchProvider } from "./Context/MunchContext";
import SelectionPage from "./Pages/SelectionPage";
import FoodList from "./Pages/FoodList";

export default function App() {
  return (
    <MunchProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path='select' element={<SelectionPage />} />
            <Route path='restaurants' element={<FoodList />} />
            {/* <Route path="contact" element={<ContactPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </MunchProvider>
  );
}
