import  { useState, useEffect } from 'react';
import { Plus, Calendar, Users } from 'lucide-react';
import Header from '../components/Header';
import StudentForm from '../components/StudentForm';
import StudentCard from '../components/StudentCard';
import AttendanceForm from '../components/AttendanceForm';
import { Student, Attendance } from '../types';
import { CLUBS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { auth } = useAuth();
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState(() => auth.role === 'coordinator' ? auth.club || '' : '');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('students');

  // Available clubs based on user role
  const availableClubs = auth.role === 'admin' 
    ? CLUBS 
    : auth.club ? [auth.club] : [];

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  // Set selected club based on role when component mounts
  useEffect(() => {
    if (auth.role === 'coordinator' && auth.club) {
      setSelectedClub(auth.club);
    }
  }, [auth.role, auth.club]);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString()
    };
    setStudents(prev => [...prev, newStudent]);
    setIsAddingStudent(false);
  };

  const deleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(student => student.id !== id));
      setAttendance(prev => prev.filter(entry => entry.studentId !== id));
    }
  };

  const recordAttendance = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
    }
  };

  const saveAttendance = (attendanceData: Omit<Attendance, 'id'>) => {
    const newAttendance: Attendance = {
      ...attendanceData,
      id: Date.now().toString()
    };
    setAttendance(prev => [...prev, newAttendance]);
    setSelectedStudent(null);
  };

  // Filter students based on search term, selected club, and user role
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For admin: show all or filtered by selected club
    // For coordinator: only show students in their club
    const matchesClub = auth.role === 'admin'
      ? selectedClub === '' || student.clubs.includes(selectedClub)
      : auth.club ? student.clubs.includes(auth.club) : false;
    
    return matchesSearch && matchesClub;
  });

  // Filter attendance records based on search term and user role
  const filteredAttendance = attendance.filter(record => {
    // Search filter
    const matchesSearch = record.studentName.toLowerCase().includes(attendanceSearchTerm.toLowerCase()) ||
                         record.clubName.toLowerCase().includes(attendanceSearchTerm.toLowerCase()) ||
                         record.date.includes(attendanceSearchTerm);
    
    // Role-based filter
    const matchesRole = auth.role === 'admin' || 
                        (auth.role === 'coordinator' && auth.club === record.clubName);
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">CLUBS Management Dashboard</h1>
            <p className="text-gray-600">
              {auth.role === 'admin' 
                ? 'Manage all CLUBS memberships and attendance' 
                : `Manage ${auth.club} membership and attendance`}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'students' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => setActiveTab('students')}
            >
              <span className="flex items-center">
                <Users className="mr-2" size={18} />
                Students
              </span>
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'attendance' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => setActiveTab('attendance')}
            >
              <span className="flex items-center">
                <Calendar className="mr-2" size={18} />
                Attendance
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'students' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="card mb-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Users size={20} className="mr-2" />
                    Student Management
                  </h2>
                  
                  <button 
                    onClick={() => setIsAddingStudent(true)}
                    className="btn btn-primary w-full flex items-center justify-center"
                  >
                    <Plus size={18} className="mr-2" />
                    Add New Student
                  </button>
                </div>
                
                {isAddingStudent && (
                  <div className="card mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Add Student</h2>
                      <button 
                        onClick={() => setIsAddingStudent(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                    <StudentForm 
                      onSubmit={addStudent} 
                      availableClubs={availableClubs}
                      restrictedToClub={auth.role === 'coordinator' ? auth.club : undefined}
                    />
                  </div>
                )}
                
                {selectedStudent && (
                  <div className="card mb-6">
                    <AttendanceForm 
                      student={selectedStudent}
                      onSubmit={saveAttendance}
                      onCancel={() => setSelectedStudent(null)}
                      restrictedToClub={auth.role === 'coordinator' ? auth.club : undefined}
                    />
                  </div>
                )}

                <div className="hidden lg:block card mt-6">
                  <h3 className="text-lg font-medium mb-3">CLUBS Activities</h3>
                  <img 
                    src="https://images.unsplash.com/photo-1527891751199-7225231a68dd?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY29sbGVnZSUyMGNhbXB1cyUyMGJ1aWxkaW5nfGVufDB8fHx8MTc0NDc5OTIyMnww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800" 
                    alt="University campus building" 
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                  <p className="text-sm text-gray-600">
                    Track CLUBS participation and manage member activities efficiently.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by name or roll number..."
                      className="input"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {auth.role === 'admin' && (
                    <select
                      className="select md:w-64"
                      value={selectedClub}
                      onChange={e => setSelectedClub(e.target.value)}
                    >
                      <option value="">All CLUBS</option>
                      {CLUBS.map(club => (
                        <option key={club} value={club}>{club}</option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">
                    Students ({filteredStudents.length})
                  </h2>
                </div>
                
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {students.length === 0 ? 
                      'No students added yet. Add your first student!' : 
                      'No students match your search criteria.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredStudents.map(student => (
                      <StudentCard 
                        key={student.id}
                        student={student}
                        onDelete={deleteStudent}
                        onAttendance={recordAttendance}
                        userRole={auth.role}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Calendar size={20} className="mr-2" />
              Attendance Records
            </h2>
            
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search attendance by student name or CLUBS..."
                className="input"
                value={attendanceSearchTerm}
                onChange={e => setAttendanceSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredAttendance.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mb-4">
                  <img 
                    src="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/01270e74-8f41-4445-9622-7da965ce5a00/public" 
                    alt="CLUBS COUNCIL SAC VVIT" 
                    className="w-32 h-32 object-contain bg-white rounded-full mx-auto mb-4"
                  />
                </div>
                <p className="text-gray-500">
                  {attendance.length === 0 ? 
                    'No attendance records yet. Mark attendance from the student list.' : 
                    'No attendance records match your search criteria.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CLUBS
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendance.map(entry => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          {entry.studentName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {entry.clubName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            entry.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
 