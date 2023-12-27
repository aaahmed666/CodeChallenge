import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CreateEntry from "./components/CreateEntry";
import EntriesList from "./components/EntriesList";
import { fetchData } from "./help/useFetch";
import { get_sectors } from "./help/url_helper";

function App() {
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    let timer = setTimeout(() => {
      fetchSectors();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const fetchSectors = async () => {
    try {
      const data = await fetchData(get_sectors);
      if (Object.keys(data).length > 0) {
        const dataArray = Object.values(data);
        setSectors(dataArray);
      }
    } catch (error) {
      console.error("Error fetching other data:", error);
    }
  };

  return (
    <Router>
      <div>
        <nav>
          <ul className="navbar">
            <li>
              <Link to="/">Create Entry</Link>
            </li>
            <li>
              <Link to="/entries-list">Entries List</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<CreateEntry sectorsArray={sectors} />} />
          <Route path="/entries-list" element={<EntriesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
