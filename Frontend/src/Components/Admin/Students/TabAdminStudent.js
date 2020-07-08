import React from 'react';
import { Tab } from 'semantic-ui-react';
import StudentsList from './StudentsList';
import AdminsList from './AdminsList';

export default function TabAdminStudent({ students, admins, deleteAdmin }) {
  // console.log('Log: Students: ', students);
  const panes = [
    {
      menuItem: 'Students',
      render: () => (
        <Tab.Pane attached={false} style={{ boxShadow: 'None', border: 'None' }}>
          <div
            class="ui segment active tab"
            style={{
              marginBottom: '20px',
              borderRadius: '0px',
              border: 'None',
              // boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)',
            }}
          >
            {students != null && <StudentsList students={students.students} />}
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Admins',
      render: () => (
        <Tab.Pane
          attached={false}
          style={{ borderRadius: '0px', boxShadow: 'None', border: 'None' }}
        >
          {admins != null && <AdminsList admins={admins.admins} deleteAdmin={deleteAdmin} />}
        </Tab.Pane>
      ),
    },
  ];
  return (
    <>
      <Tab panes={panes} menu={{ secondary: true, pointing: true }} />
    </>
  );
}
