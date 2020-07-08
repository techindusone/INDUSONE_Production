import React from 'react';
import { StudentUserCard } from './AdminStudentCard';

export default function StudentsList({ students }) {
  return (
    <div className="col-lg-12" style={{ paddingLeft: '10vw', paddingRight: '10vw' }}>
      {students.map((student) => {
        return (
          <div className="column" style={{ paddingTop: '2.5vh' }}>
            <div>
              <StudentUserCard student={student} />
              <br />
            </div>
          </div>
        );
      })}
    </div>
  );
}
