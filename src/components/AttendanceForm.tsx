import  { useState, useEffect } from 'react';
import { Student, Attendance } from '../types';

interface AttendanceFormProps {
  student: Student;
  onSubmit: (attendance: Omit<Attendance, 'id'>) => void;
  onCancel: () => void;
  restrictedToClub?: string;
}

const AttendanceForm = ({ student, onSubmit, onCancel, restrictedToClub }: AttendanceFormProps) => {
  const [formData, setFormData] = useState({
    studentId: student.id,
    studentName: student.name,
    clubName: restrictedToClub || (student.clubs.length > 0 ? student.clubs[0] : ''),
    date: new Date().toISOString().split('T')[0],
    present: true
  });

  // Update clubName if restrictedToClub changes
  useEffect(() => {
    if (restrictedToClub) {
      setFormData(prev => ({
        ...prev,
        clubName: restrictedToClub
      }));
    }
  }, [restrictedToClub]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Filter for clubs this student belongs to
  const availableClubs = restrictedToClub 
    ? student.clubs.filter(club => club === restrictedToClub)
    : student.clubs;

  const canSubmit = availableClubs.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Record Attendance</h2>
      <p className="text-gray-600">Student: {student.name} ({student.rollNumber})</p>
      
      <div className="form-group">
        <label className="block mb-1">CLUBS</label>
        <select
          name="clubName"
          className="select"
          value={formData.clubName}
          onChange={handleChange}
          required
          disabled={restrictedToClub !== undefined || availableClubs.length === 0}
        >
          <option value="">Select CLUBS</option>
          {availableClubs.map(club => (
            <option key={club} value={club}>{club}</option>
          ))}
        </select>
        {!canSubmit && (
          <p className="text-sm text-red-600 mt-1">
            {restrictedToClub 
              ? `This student is not a member of ${restrictedToClub}. Please add them to your CLUB first.`
              : 'This student is not a member of any CLUBS. Please edit student details first.'}
          </p>
        )}
      </div>
      
      <div className="form-group">
        <label className="block mb-1">Date</label>
        <input
          type="date"
          name="date"
          className="input"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="present"
            checked={formData.present}
            onChange={handleCheckboxChange}
            className="rounded text-blue-600"
          />
          <span>Present</span>
        </label>
      </div>
      
      <div className="flex space-x-4">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!canSubmit}
        >
          Save Attendance
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm;
 