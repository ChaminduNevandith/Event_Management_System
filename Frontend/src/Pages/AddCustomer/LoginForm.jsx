import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Loader2, AlertCircle, 
  CheckCircle2, Sparkles, Mail, Lock, 
  CalendarHeart 
} from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

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
        setSuccessMessage('Login successful! Redirecting...');
        
        // Store user name and NIC in local storage (kept from your original code)
        localStorage.setItem('userFullName', data.user.name);
        localStorage.setItem('userNIC', data.user.nic);

        // Brief delay so the user sees the success state before navigating
        setTimeout(() => {
          navigate('/show');
        }, 1200);
      } else {
        setErrorMessage(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network error: Unable to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Applied the Poppins font family here to match the Register page
    <div className="min-h-screen flex bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left Panel - Branding (Matches Register Page exactly for consistency) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-500 text-white items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-indigo-300 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl backdrop-blur-md mb-6">
            <CalendarHeart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Plan. Create.<br />Celebrate.
          </h1>
          <p className="text-lg text-indigo-50 mb-8 leading-relaxed font-light">
            Join thousands of organizers and guests. Create unforgettable experiences, manage guest lists, and discover amazing events happening near you.
          </p>
          
          <div className="flex items-center space-x-4 text-sm font-medium bg-white/10 w-fit px-5 py-3 rounded-full backdrop-blur-sm border border-white/20">
            <Sparkles className="w-5 h-5 text-fuchsia-300" />
            <span>Welcome back to the party!</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-gray-500 font-light">Please enter your details to sign in.</p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 flex items-start p-4 text-sm text-red-800 border border-red-200 rounded-2xl bg-red-50">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-6 flex items-start p-4 text-sm text-green-800 border border-green-200 rounded-2xl bg-green-50 font-medium">
              <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-4 mb-8 font-light">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:border-transparent transition-all duration-200 disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:border-transparent transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Optional: Forgot Password Link */}
            <div className="flex justify-end mt-2">
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center mt-8 font-light">
            <p className="text-gray-500">
              Don't have an account?{' '}
              <Link 
                to="/Register" 
                className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none focus:underline transition-all"
              >
                Create one here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;