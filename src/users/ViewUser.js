import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ViewUser() {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8088/user/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user details');
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 text-center mt-5'>
            <div className='spinner-border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
            <div className='alert alert-danger' role='alert'>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
          <h2 className='text-center m-4'>User Details</h2>
          <div className='card'>
            <div className='card-header'>
              Details of the user id : {id}
              <ul className='list-group list-group-flush'>
                <li className='list-group-item'>
                  <b>Name:</b> {user.name}
                </li>
                <li className='list-group-item'>
                  <b>Username:</b> {user.username}
                </li>
                <li className='list-group-item'>
                  <b>Email:</b> {user.email}
                </li>
              </ul>
            </div>
          </div>
          <Link className="btn btn-primary my-2" to={"/"}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
}