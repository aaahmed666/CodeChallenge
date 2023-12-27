import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get_posts } from "../help/url_helper";
import { fetchData } from "../help/useFetch";

const EntriesList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => {
      fetchEntries();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await fetchData(get_posts);
      if (Object.keys(data).length > 0) {
        const dataArray = Object.values(data);
        setEntries(dataArray);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="registration-form table-list">
      <h2>Entries List</h2>
      {Array.isArray(entries) && entries?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Sectors</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((entry, index) => (
              <tr key={entry?.id}>
                <td>{index + 1}</td>
                <td>{entry?.name}</td>
                <td>{entry?.sectors?.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No data found</p>
      )}
      <Link to="/">Go to Create Entry</Link>
    </div>
  );
};

export default EntriesList;
