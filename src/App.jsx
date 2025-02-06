// src/App.jsx
import React, { useState, useEffect } from 'react';
import ItemList from "./components/ItemList";

const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;


const styles = {
  appContainer: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    textAlign: 'center',
  },
  loading: {
    fontSize: '20px',
    textAlign: 'center',
    marginTop: '50px',
  },
  error: {
    color: 'red',
    fontSize: '18px',
    textAlign: 'center',
    marginTop: '50px',
  },
};

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(API_URI);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URI}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }
      const deletedItem = await response.json();
      setItems(items.filter(item => item.id !== deletedItem.id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.appContainer}>
      <h1>Door List</h1>
      <ItemList items={items} onDelete={deleteItem} />
    </div>
  );
}


export default App;