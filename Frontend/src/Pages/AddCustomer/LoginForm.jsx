import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate(); // Hook to navigate to other pages

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage('');
        setSuccessMessage('Login successful');
        console.log('User data:', data.user);

        // Store user name and NIC in local storage
        localStorage.setItem('userFullName', data.user.name);
        localStorage.setItem('userNIC', data.user.nic);

        // Navigate to "show" page on successful login
        navigate('/show');
      } else {
        setSuccessMessage('');
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      setSuccessMessage('');
      setErrorMessage('Error: Unable to login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white lg:bg-gray-200">
      <form
        className="bg-white shadow-hidden lg:shadow-md rounded px-8 pt-20 pb-20 mb-4 w-full  max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center mb-2">LOGIN</h1>
        <p className="text-center text-gray-600 mb-6">Login to your account!</p>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        <div className="mb-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded-md  border-black  w-full h-12 py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border  rounded-md  border-black  w-full h-12  py-2 px-3 bg-gray-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            LOGIN
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/Register" className="text-blue-500 hover:text-blue-700">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
