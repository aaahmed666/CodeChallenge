import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get_posts } from "../help/url_helper";
import { fetchData } from "../help/useFetch";
import FormView from "./FormView";

const CreateEntry = ({ sectorsArray }) => {
  const [entries, setEntries] = useState([]);
  const [editingData, setEditingData] = useState(null);
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

  const handleSave = (data) => {
    try {
      if (editingData) {
        const updatedEntries = [...entries];
        const index = updatedEntries.findIndex(
          (entry) => entry.id === editingData.id
        );

        if (index !== -1) {
          updatedEntries[index] = { ...editingData, ...data };
        }

        setEntries(updatedEntries);
        setEditingData(null);
      } else {
        const newEntry = { id: entries.length + 1, ...data };
        setEntries([...entries, newEntry]);
        setEditingData(null);
      }
    } catch (error) {
      console.error("Error handling save:", error);
    }
  };

  const handleEdit = (entry) => {
    setEditingData(entry);
  };

  const handleDelete = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    setEditingData(null);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="registration-form">
      <h2>Create Entry</h2>
      <FormView
        onSave={handleSave}
        editData={editingData}
        refillData={editingData}
        sectorsArray={sectorsArray}
      />
      {Array.isArray(entries) && entries?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Sectors</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((entry) => (
              <tr key={entry?.id}>
                <td>{entry?.name}</td>
                <td>{entry?.sectors?.join(", ")}</td>
                <td>
                  <button onClick={() => handleEdit(entry)}>Edit</button>
                  <button onClick={() => handleDelete(entry.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No data found</p>
      )}
      <Link to="/entries-list">Go to Entries List</Link>
    </div>
  );
};

export default CreateEntry;
