import React, { useState } from "react";
import { 
  Users, UserPlus, Search, Mail, 
  MessageSquare, UserX, X, ShieldCheck,
  Hash, Copy, Send
} from "lucide-react";
import Sidebar from "../../Componets/Sidebar"; // Adjust path as needed

const Friends = () => {
  // Mock data for initial friends list
  const [friends, setFriends] = useState([
    { id: 1, name: "Alex Carter", email: "alex@example.com", eventsAttended: 4, isOrganizer: true },
    { id: 2, name: "Sarah Jenkins", email: "sarah@example.com", eventsAttended: 12, isOrganizer: false },
    { id: 3, name: "Marcus Johnson", email: "marcus@example.com", eventsAttended: 2, isOrganizer: false },
    { id: 4, name: "Emily Chen", email: "emily@example.com", eventsAttended: 7, isOrganizer: true },
  ]);

  // Modal and Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMethod, setAddMethod] = useState("email"); // "email" or "code"
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // The logged-in user's mock Friend Code
  const myFriendCode = "#EV-8492";

  // Handle adding/inviting a new friend
  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);

    // Simulate an API call delay
    setTimeout(() => {
      if (addMethod === "code") {
        // Mock adding a user directly via their friend code
        const newFriend = {
          id: Date.now(),
          name: "New Friend",
          email: `user_${inputValue.replace('#', '')}@example.com`, 
          eventsAttended: 0,
          isOrganizer: false,
        };
        setFriends([newFriend, ...friends]);
        alert("Friend added successfully!");
      } else {
        // Mock sending an email invite
        alert(`Awesome! An invitation has been sent to ${inputValue}. They will appear in your network once they join!`);
      }

      setIsLoading(false);
      setIsAddModalOpen(false);
      setInputValue("");
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(myFriendCode);
    alert("Friend code copied to clipboard!");
  };

  // Handle removing a friend
  const handleRemoveFriend = (friendId, friendName) => {
    if (window.confirm(`Are you sure you want to remove ${friendName} from your friends list?`)) {
      setFriends(friends.filter(f => f.id !== friendId));
    }
  };

  // Filter friends based on search bar
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Dashboard Sidebar */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Network</h2>
              <p className="text-gray-500 mt-1 font-light">Connect with friends and co-organizers.</p>
            </div>
            
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Friend
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center max-w-md">
            <div className="pl-4 pr-2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search your friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-2.5 px-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Friends Grid */}
          {filteredFriends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
                  
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 relative">
                    {friend.name.charAt(0).toUpperCase()}
                    {friend.isOrganizer && (
                      <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white" title="Event Organizer">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1 capitalize">{friend.name}</h3>
                  <p className="text-sm text-gray-500 font-light mb-4">{friend.email}</p>
                  
                  <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-medium text-gray-600 mb-6 w-full">
                    Attended <span className="text-indigo-600 font-bold">{friend.eventsAttended}</span> Events
                  </div>

                  {/* Actions */}
                  <div className="flex w-full space-x-2 mt-auto border-t border-gray-100 pt-4">
                    <button className="flex-1 flex items-center justify-center py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 rounded-lg transition-colors font-medium text-sm">
                      <MessageSquare className="w-4 h-4 mr-1.5" />
                      Chat
                    </button>
                    <button 
                      onClick={() => handleRemoveFriend(friend.id, friend.name)}
                      className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      title="Remove Friend"
                    >
                      <UserX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No friends found</h3>
              <p className="text-gray-500 max-w-md">
                {searchQuery ? "We couldn't find anyone matching your search." : "Your network is currently empty. Start adding friends to invite them to your events!"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* =========================================
          ADD FRIEND / INVITE MODAL 
      ========================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Grow Your Network</h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setInputValue("");
                }} 
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              
              {/* Method Toggle Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button 
                  type="button"
                  onClick={() => setAddMethod("email")}
                  className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-lg transition-all ${addMethod === "email" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Mail className="w-4 h-4 mr-2" /> Invite via Email
                </button>
                <button 
                  type="button"
                  onClick={() => setAddMethod("code")}
                  className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-lg transition-all ${addMethod === "code" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Hash className="w-4 h-4 mr-2" /> Friend Code
                </button>
              </div>

              <form onSubmit={handleAddFriend}>
                {addMethod === "email" ? (
                  /* EMAIL INPUT */
                  <div className="mb-6 animate-in fade-in slide-in-from-left-2 duration-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="friend_email">
                      Email Address
                    </label>
                    <p className="text-gray-500 text-xs mb-3 font-light">
                      Send an invitation to join EventPro. If they sign up, they will be added to your friends list.
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="friend_email"
                        type="email"
                        placeholder="friend@example.com"
                        value={addMethod === "email" ? inputValue : ""}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                ) : (
                  /* FRIEND CODE INPUT */
                  <div className="mb-6 animate-in fade-in slide-in-from-right-2 duration-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="friend_code">
                      Enter Friend Code
                    </label>
                    <p className="text-gray-500 text-xs mb-3 font-light">
                      Have a friend already on the app? Enter their unique code to instantly connect.
                    </p>
                    <div className="relative mb-6">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="friend_code"
                        type="text"
                        placeholder="e.g. #EV-1234"
                        value={addMethod === "code" ? inputValue : ""}
                        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                        required
                        disabled={isLoading}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all disabled:opacity-50 uppercase tracking-widest"
                      />
                    </div>

                    {/* Show User's Own Code */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-0.5">Your Friend Code</p>
                        <p className="text-lg font-bold text-indigo-600 tracking-widest">{myFriendCode}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={copyToClipboard}
                        className="p-2.5 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg shadow-sm transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-8">
                  <button 
                    type="button" 
                    disabled={isLoading}
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setInputValue("");
                    }} 
                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading || !inputValue.trim()}
                    className="flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        {addMethod === "email" ? <Send className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                        {addMethod === "email" ? "Send Invite" : "Add Friend"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;