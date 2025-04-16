import  { Trash, Calendar, User } from 'lucide-react';
import { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onDelete: (id: string) => void;
  onAttendance: (id: string) => void;
  userRole?: "admin" | "coordinator" | null;
}

const StudentCard = ({ student, onDelete, onAttendance, userRole }: StudentCardProps) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{student.name}</h3>
          <p className="text-gray-600">{student.rollNumber}</p>
          <p className="text-sm text-gray-500">
            {student.year} • {student.branch}-{student.section}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onAttendance(student.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Record Attendance"
          >
            <Calendar size={18} />
          </button>
          {userRole === 'admin' && (
            <button 
              onClick={() => onDelete(student.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              title="Delete Student"
            >
              <Trash size={18} />
            </button>
          )}
        </div>
      </div>
      
      {student.clubs.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">CLUBS:</h4>
          <div className="flex flex-wrap gap-2">
            {student.clubs.map(club => (
              <span 
                key={club}
                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {club}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
 