import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, users } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2">
            <Users size={24} />
            <h1 className="text-xl font-bold">CLUBS Management System</h1>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          <div className="hidden md:block">
            <div className="rounded-lg overflow-hidden shadow-xl h-full">
              <img 
                src="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/01270e74-8f41-4445-9622-7da965ce5a00/public" 
                alt="CLUBS COUNCIL SAC VVIT" 
                className="object-contain bg-white h-full w-full"
              />
            </div>
          </div>
          
          <div className="card shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">Coordinator Login</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="form-group">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="input"
                  placeholder="Username"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input"
                  placeholder="Password"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary w-full">
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
 