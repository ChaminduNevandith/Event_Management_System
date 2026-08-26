import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, LayoutDashboard, PlusCircle, 
  CalendarDays, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user name from local storage
  const userName = localStorage.getItem('userFullName') || 'Guest';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-10 shadow-sm flex-shrink-0">
      {/* Sidebar Header / Logo */}
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">EventPro</h1>
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Menu
        </p>
        
        <button 
          onClick={() => navigate('/show')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
            location.pathname === '/show' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Discover Events
        </button>

        <button 
          onClick={() => navigate('/add-event')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
            location.pathname === '/add-event' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <PlusCircle className="w-5 h-5 mr-3" />
          Add Event
        </button>

         <button 
          onClick={() => navigate('/My Events')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
            location.pathname === '/My Events' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <PlusCircle className="w-5 h-5 mr-3" />
          My Events
        </button>


        <button 
          onClick={() => navigate('/calendar')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
            location.pathname === '/calendar' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <CalendarDays className="w-5 h-5 mr-3" />
          Event Calendar
        </button>

        <button 
          onClick={() => navigate('/Friends')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
            location.pathname === '/Friends' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <CalendarDays className="w-5 h-5 mr-3" />
          Friends
        </button>

        <button 
          onClick={() => navigate('/Hotels')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
            location.pathname === '/Hotels' 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <PlusCircle className="w-5 h-5 mr-3" />
          Hotels
        </button>


      </nav>

       

      {/* Sidebar Footer (User Info & Logout) */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center px-4 py-3 mb-2 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;