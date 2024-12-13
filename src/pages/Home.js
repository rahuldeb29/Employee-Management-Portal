import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get("http://localhost:8088/users");
      setUsers(result.data);
      setError(null);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8088/user/${id}`);
      // Optimistically remove the user from the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      
      // Reload the full list to ensure consistency with backend
      await loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="py-4">
        <div className="mb-3">
          <Link to="/adduser" className="btn btn-primary">
            Add New User
          </Link>
        </div>
        <table className="table table-striped border shadow">
          <thead className="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link 
                      className="btn btn-info btn-sm mx-1" 
                      to={`/viewuser/${user.id}`}
                    >
                      View
                    </Link>
                    <Link 
                      className="btn btn-outline-primary btn-sm mx-1" 
                      to={`/edituser/${user.id}`}
                    >
                      Edit
                    </Link>
                    <button 
                      className="btn btn-danger btn-sm mx-1" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this user?')) {
                          deleteUser(user.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}