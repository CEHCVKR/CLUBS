import  { useState } from 'react';
import { X, Eye, EyeOff, Save, Plus, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { CLUBS } from '../utils/constants';

interface ManageCredentialsProps {
  onClose: () => void;
}

const ManageCredentials = ({ onClose }: ManageCredentialsProps) => {
  const { users, setUsers, updateUserPassword } = useAuth();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'username'> & {username: string}>({
    username: '',
    password: '',
    role: 'coordinator',
    club: null
  });

  const handleTogglePassword = (username: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  const handleSavePassword = (username: string) => {
    if (newPassword.trim().length === 0) return;
    
    updateUserPassword(username, newPassword);
    setEditingUser(null);
    setNewPassword('');
  };

  const handleAddUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username is unique
    if (users.some(user => user.username === newUser.username)) {
      alert('Username already exists. Please choose a different username.');
      return;
    }
    
    if (newUser.username.trim() === '' || newUser.password.trim() === '') {
      alert('Username and password are required.');
      return;
    }
    
    const userToAdd: User = {
      username: newUser.username,
      password: newUser.password,
      role: newUser.role as 'admin' | 'coordinator',
      club: newUser.role === 'coordinator' ? newUser.club : null
    };
    
    setUsers([...users, userToAdd]);
    
    // Reset form
    setNewUser({
      username: '',
      password: '',
      role: 'coordinator',
      club: null
    });
    
    setShowAddUser(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Manage User Credentials</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Users</h3>
            <button 
              onClick={() => setShowAddUser(!showAddUser)}
              className="btn btn-primary flex items-center space-x-1"
            >
              <UserPlus size={18} />
              <span>Add New User</span>
            </button>
          </div>
          
          {showAddUser && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-3">Create New User</h4>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block mb-1 text-sm">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={newUser.username}
                      onChange={handleAddUserChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block mb-1 text-sm">Password</label>
                    <input
                      type="text"
                      name="password"
                      value={newUser.password}
                      onChange={handleAddUserChange}
                      className="input"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block mb-1 text-sm">Role</label>
                    <select
                      name="role"
                      value={newUser.role}
                      onChange={handleAddUserChange}
                      className="select"
                    >
                      <option value="admin">Administrator</option>
                      <option value="coordinator">Coordinator</option>
                    </select>
                  </div>
                  
                  {newUser.role === 'coordinator' && (
                    <div className="form-group">
                      <label className="block mb-1 text-sm">Assigned CLUB</label>
                      <select
                        name="club"
                        value={newUser.club || ''}
                        onChange={handleAddUserChange}
                        className="select"
                        required={newUser.role === 'coordinator'}
                      >
                        <option value="">Select a CLUB</option>
                        {CLUBS.map(club => (
                          <option key={club} value={club}>{club}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddUser(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CLUBS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Password
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.username} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {user.role === 'admin' ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          Administrator
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Coordinator
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {user.club || 'All CLUBS'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingUser === user.username ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input text-sm py-1"
                            placeholder="New password"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePassword(user.username)}
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                          >
                            <Save size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>
                            {showPasswords[user.username] ? user.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => handleTogglePassword(user.username)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords[user.username] ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingUser === user.username ? (
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingUser(user.username);
                            setNewPassword('');
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Change Password
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t">
          <p className="text-sm text-gray-600">
            All credentials are stored locally in your browser. 
            Admin can view and modify all CLUBS data, while coordinators can only manage their assigned CLUB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageCredentials;
 