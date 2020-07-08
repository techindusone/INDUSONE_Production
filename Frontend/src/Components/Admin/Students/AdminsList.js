import React from 'react';
import AdminUserCard from './AdminStudentCard';

export default function AdminsList({ admins, deleteAdmin }) {
  return (
    <div className="col-lg-12" style={{ paddingLeft: '10vw', paddingRight: '10vw' }}>
      {admins.map((admin) => {
        return (
          <div className="column" style={{ paddingTop: '2.5vh' }}>
            <div>
              <AdminUserCard admin={admin} deleteAdmin={deleteAdmin} />
              <br />
            </div>
          </div>
        );
      })}
    </div>
  );
}
