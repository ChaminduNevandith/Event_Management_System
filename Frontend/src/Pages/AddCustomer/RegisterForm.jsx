import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    contactNo: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();  // Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nic: formData.nic,
          name: formData.fullName,
          contactNo: formData.contactNo,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Registration successful');
        console.log('User registered:', data.message);

        // Store name and NIC in local storage
        localStorage.setItem('userFullName', formData.fullName);
        localStorage.setItem('userNIC', formData.nic);
        
        // Navigate to /show on successful registration
        navigate('/show');
      } else {
        setSuccessMessage('');
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      setSuccessMessage('');
      setErrorMessage('Error: Unable to register');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white lg:bg-gray-200">
      <form
        className="bg-white shadow-hidden lg:shadow-md rounded px-8 pt-20 pb-20 mb-4 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center mb-2">REGISTER</h1>
        <p className="text-center text-gray-600 mb-6">Register To the Event Management System</p>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        <div className="mb-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded-md border-black w-full h-12 py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="nic"
            placeholder="NIC"
            value={formData.nic}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded-md border-black w-full h-12 py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <input
            type="tel"
            name="contactNo"
            placeholder="Contact No"
            value={formData.contactNo}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded-md border-black w-full h-12 py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            value={formData.email}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded-md border-black w-full h-12 py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded-md border-black w-full h-12 py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
