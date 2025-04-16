import  { useState } from 'react';
import { Student } from '../types';
import { CLUBS, YEARS, BRANCHES, SECTIONS } from '../utils/constants';

interface StudentFormProps {
  onSubmit: (student: Omit<Student, 'id'>) => void;
  initialData?: Student;
  buttonText?: string;
  availableClubs?: string[];
  restrictedToClub?: string;
}

const StudentForm = ({ 
  onSubmit, 
  initialData, 
  buttonText = 'Add Student',
  availableClubs = CLUBS,
  restrictedToClub
}: StudentFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    rollNumber: initialData?.rollNumber || '',
    year: initialData?.year || YEARS[0],
    branch: initialData?.branch || BRANCHES[0],
    section: initialData?.section || SECTIONS[0],
    clubs: initialData?.clubs || (restrictedToClub ? [restrictedToClub] : [])
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClubChange = (club: string) => {
    // If restricted to a specific club, don't allow changes
    if (restrictedToClub) return;
    
    setFormData(prev => {
      const newClubs = prev.clubs.includes(club)
        ? prev.clubs.filter(c => c !== club)
        : [...prev.clubs, club];
      return { ...prev, clubs: newClubs };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          className="input"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="block mb-1">Roll Number</label>
        <input
          type="text"
          name="rollNumber"
          className="input"
          value={formData.rollNumber}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-group">
          <label className="block mb-1">Year</label>
          <select
            name="year"
            className="select"
            value={formData.year}
            onChange={handleChange}
          >
            {YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="block mb-1">Branch</label>
          <select
            name="branch"
            className="select"
            value={formData.branch}
            onChange={handleChange}
          >
            {BRANCHES.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="block mb-1">Section</label>
          <select
            name="section"
            className="select"
            value={formData.section}
            onChange={handleChange}
          >
            {SECTIONS.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label className="block mb-2">CLUBS</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {availableClubs.map(club => (
            <label 
              key={club} 
              className={`flex items-center space-x-2 ${
                restrictedToClub && club !== restrictedToClub ? 'opacity-50' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={formData.clubs.includes(club)}
                onChange={() => handleClubChange(club)}
                className="rounded text-blue-600"
                disabled={restrictedToClub !== undefined}
              />
              <span className="text-sm">{club}</span>
            </label>
          ))}
        </div>
        {restrictedToClub && (
          <p className="text-xs text-blue-600 mt-2">
            As a CLUBS coordinator, you can only add students to your assigned CLUB.
          </p>
        )}
      </div>
      
      <button type="submit" className="btn btn-primary">
        {buttonText}
      </button>
    </form>
  );
};

export default StudentForm;
 