import React, { useState, useEffect } from 'react';
import '../Profile.css';

export const PersonalInfo = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  console.log(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const fetchPersonalInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const lastFetchedTime = localStorage.getItem('lastFetchedTime');

      const response = await fetch('http://localhost:8000/app/v1/profile/details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'If-Modified-Since': lastFetchedTime, // Conditional header
        },
      });

      if (!response.ok) {
        if (response.status === 304) {
          console.log('Data not modified'); // Handle 304 case
        } else {
          throw new Error('Failed to fetch personal info');
        }
      } else {
        const data = await response.json();
        setFormData(data);
        localStorage.setItem('lastFetchedTime', new Date().toISOString());
      }
    } catch (error) {
      console.error('Error fetching personal info:', error);
      setError(error.message);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/app/v1/profile/update-user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update personal info');
      }
  
      // Update state with the new form data
      setUserData(formData);
      console.log("User updated successfully")
      setSuccessMessage('Personal Details update successfully!');
      setIsEditing(false); // Optionally, you can set isEditing to false here
    } catch (error) {
      setError(error.message);
      console.error('Error updating personal info:', error);
    }
  };
  

  // Moved useEffect hook below to ensure data fetching occurs after component mounts
  useEffect(() => {
    fetchPersonalInfo();
  }, []);  // Empty dependency array to run once on component mount

  return (
    <>
      {error && <div>Error: {error}</div>}
      {formData && (
      <div>
        <h3 className="mb-4 text-uppercase text-left">
          <i className="fa fa-briefcase"></i> &nbsp; Personal Info
        </h3>

        <div className="row">
          <div className="col-lg-6">
            <div className="form-group text-left d-flex align-items-center mb-4">
              <label htmlFor="first_name" className="mr-2 profilelabel">First Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              ) : (
                <p className="ps-2 mb-0 profilecontent">{formData.data.firstName || '—'}</p>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-group text-left  d-flex align-items-center mb-4">
              <label htmlFor="last_name" className="mr-2 profilelabel">Last Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              ) : (
                <p className="ps-2 mb-0 profilecontent">{formData.data.lastName || '—'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-lg-6">
            <div className="form-group text-left d-flex align-items-center  mb-4">
              <label htmlFor="email" className="mr-2 profilelabel">Email : </label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <p className="ps-2 mb-0 profilecontent">{formData.data.email || '—'}</p>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-group text-left d-flex align-items- mb-4">
              <label htmlFor="contact_number" className="mr-2 profilelabel">Contact Number : </label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  id="contact_number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              ) : (
                <p className="ps-2 mb-0 profilecontent">{formData.data.phoneNumber || '—'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-lg-6">
            <div className="form-group text-left d-flex align-items-center mb-4">
              <label htmlFor="present_address" className="mr-2 profilelabel">Address:</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  id="present_address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData,address: e.target.value })}
                />
              ) : (
                <p className="ps-2 mb-0 profilecontent">{formData.data.address || '—'}</p>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-group text-left d-flex align-items-center mb-4">
              <label htmlFor="permanent_address" className="mr-2 profilelabel">Role:</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  id="permanent_address"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData,role: e.target.value })}
                />
              ) : (
                <p className="ps-2 mb-0 profilecontent">{formData.data.role || '—'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-lg-12">
            {isEditing ? (
              <button className="btn btn-primary" onClick={handleSaveClick}>
                Save
              </button>
            ) : (
              <button className="btn btn-warning" onClick={handleEditClick}>
                Edit
              </button>
            )}
          </div>
          <div className='h5 text-success p-3'>{successMessage}</div>
        </div>
      </div>
      )}
    </>
  );
};
