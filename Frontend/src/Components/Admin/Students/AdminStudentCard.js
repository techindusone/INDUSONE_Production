import React from 'react';

export function StudentUserCard({ student }) {
  return (
    <div>
      {student ? (
        <div
          class="ui card"
          style={{ borderRadius: '0', width: '100%', boxShadow: '0 6px 20px -5px rgba(0,0,0,0.2)' }}
        >
          <div class="content">
            <div class="container">
              <div class="row">
                <div class="col-lg-8" style={{ marginBottom: '10px' }}>
                  <h1 style={{ paddingTop: '0px', paddingBottom: '-30px' }}>{student.name}</h1>
                  <p style={{ fontWeight: '400' }}>
                    <span style={{ color: '#7910ea' }}>{student.email}</span>, {student.email}
                  </p>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default function AdminUserCard({ admin, deleteAdmin }) {
  return (
    <div>
      {admin ? (
        <div
          class="ui card"
          style={{ borderRadius: '0', width: '100%', boxShadow: '0 6px 20px -5px rgba(0,0,0,0.2)' }}
        >
          <div class="content">
            <div class="container">
              <div class="row">
                <div class="col-lg-11" style={{ marginBottom: '10px' }}>
                  <h1 style={{ paddingTop: '0px', paddingBottom: '-30px' }}>{admin.username}</h1>
                  <p style={{ fontWeight: '400' }}>
                    <span style={{ color: '#7910ea' }}>{admin.email}</span>
                  </p>
                </div>
                <div class="col-lg-1" style={{ marginTop: '15px', display: 'block' }}>
                  <a
                    onClick={() => deleteAdmin(admin.id)}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      borderRadius: '0',
                      textAlign: 'center',
                      fontFamily: 'Montserrat',
                      fontWeight: '500',
                    }}
                  >
                    Delete
                    <i
                      aria-hidden="true"
                      class="icon delete calendar"
                      style={{ width: '100%', height: '2vh', color: '#fc0366' }}
                    ></i>
                  </a>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
