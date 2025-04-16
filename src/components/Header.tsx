import  { LogOut, Users, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ManageCredentials from './ManageCredentials';

const Header = () => {
  const { auth, logout } = useAuth();
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  return (
    <>
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users size={24} />
            <h1 className="text-xl font-bold">CLUBS Management System</h1>
          </div>
          {auth.isAuthenticated && (
            <div className="flex items-center space-x-4">
              <span>Welcome, {auth.username}</span>
              {auth.role === 'admin' && (
                <button 
                  onClick={() => setShowCredentialsModal(true)} 
                  className="flex items-center space-x-1 text-white hover:text-blue-200"
                  title="Manage user credentials"
                >
                  <UserCog size={18} />
                  <span className="hidden sm:inline">Manage Users</span>
                </button>
              )}
              <button 
                onClick={logout} 
                className="flex items-center space-x-1 text-white hover:text-blue-200"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {showCredentialsModal && (
        <ManageCredentials onClose={() => setShowCredentialsModal(false)} />
      )}
    </>
  );
};

export default Header;
 