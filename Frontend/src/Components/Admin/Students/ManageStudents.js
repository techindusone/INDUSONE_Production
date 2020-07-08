import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import CreateAdmin from './CreateAdmin';
import TabAdminStudent from './TabAdminStudent';
import gql from 'graphql-tag';

const GET_STUDENTS = gql`
  query students {
    students {
      name
      phone
      gender
      college
      hasGoogle
      hasLinkedIn
      subscription
    }
  }
`;

const GET_ADMINS = gql`
  query admins {
    admins {
      id
      dateJoined
      email
      username
      password
    }
  }
`;

const DELETE_ADMIN = gql`
  mutation deleteAdmin($id: String!) {
    deleteAdmin(id: $id) {
      success
    }
  }
`;

const CREATE_ADMIN = gql`
  mutation createAdmin($email: String!, $username: String!, $password: String!) {
    createAdmin(email: $email, password: $password, username: $username) {
      user {
        id
      }
    }
  }
`;

export default function ManageStudents() {
  const [mode, setMode] = useState('LIST');
  const [listof, setListOf] = useState('ADMIN');
  const studentsData = useQuery(GET_STUDENTS);
  const adminsData = useQuery(GET_ADMINS);

  const [createAdminMutation, { createStudentData }] = useMutation(CREATE_ADMIN, {
    update(proxy, result) {
      // console.log('Log: Created the admin successfully: ', result);
    },
    onError(err) {
      console.log('Log: Error creating the admin: ', err);
    },
  });

  const [deleteAdminMutation, { deleteStudentData }] = useMutation(DELETE_ADMIN, {
    update(proxy, result) {
      // console.log('Log: Deleted the adin successfully', result);
    },
    onError(err) {
      console.log('Log: Error deleting the student', err);
    },
  });

  const deleteAdmin = (adminId) => {
    deleteAdminMutation({
      variables: {
        id: adminId,
      },
      refetchQueries: [
        {
          query: GET_ADMINS,
        },
      ],
    }).then((_) => {
      setMode('LIST');
    });
  };

  const createAdmin = (adminDetails) => {
    createAdminMutation({
      variables: adminDetails,
      refetchQueries: [
        {
          query: GET_ADMINS,
        },
      ],
    }).then((_) => {
      setMode('LIST');
    });
  };

  return (
    <div style={{ height: '100%', width: '100vw' }}>
      {mode === 'LIST' && (
        <div style={{ paddingTop: '2vh', paddingLeft: '5vw', paddingRight: '5vw' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <a
              class="button"
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={() => setMode('CREATE')}
            >
              Create Admin <i class="ti-arrow-right"></i>
            </a>
          </div>
          <TabAdminStudent
            students={studentsData.data}
            admins={adminsData.data}
            deleteAdmin={deleteAdmin}
          />
        </div>
      )}
      {mode === 'CREATE' && (
        <div style={{ paddingTop: '2vh', paddingLeft: '5vw', paddingRight: '5vw' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <a
              class="button"
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={() => setMode('LIST')}
            >
              Back <i class="ti-arrow-left"></i>
            </a>
          </div>
          <CreateAdmin setMode={setMode} createAdmin={createAdmin} />
        </div>
      )}
    </div>
  );
}
