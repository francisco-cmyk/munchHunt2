import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Layout from "./Layout"


export default function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
          {/* <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}
