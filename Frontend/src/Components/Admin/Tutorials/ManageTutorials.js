import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import AddEditTutorial from './AddEditTutorials';
import TutorialList from './TutorialList';

const tutorials = gql`
  query {
    tutorials {
      id
      title
      content
      createdDate
      updatedDate
    }
  }
`;

const CREATE_TUTORIALS = gql`
  mutation createTutorial($title: String, $content: String) {
    createTutorial(title: $title, content: $content) {
      tutorial {
        id
        title
        content
        createdDate
        updatedDate
      }
    }
  }
`;

const UPDATE_TUTORIAL = gql`
  mutation updateTutorial($id: String!, $title: String, $content: String) {
    updateTutorial(id: $id, title: $title, content: $content) {
      tutorial {
        id
        title
        content
        createdDate
        updatedDate
      }
    }
  }
`;

const DELETE_TUTORIAL = gql`
  mutation deleteTutorial($id: String) {
    deleteTutorial(id: $id) {
      success
    }
  }
`;

export default function ManageTutorials() {
  const [mode, setMode] = useState('/list');
  const [values, setValues] = useState({ title: '', content: '' });
  const [editTutorial, setEditTutorial] = useState(null);

  const { data, loading } = useQuery(tutorials);
  // console.log(data);
  if (data) {
    // console.log(data.tutorials);
  }
  const [createTutorial] = useMutation(CREATE_TUTORIALS);
  const [updateTutorial] = useMutation(UPDATE_TUTORIAL);
  const [deleteTutorial] = useMutation(DELETE_TUTORIAL);

  const create_tutorial = (values, mark) => {
    createTutorial({
      variables: {
        title: values.title,
        content: mark,
      },
      refetchQueries: [
        {
          query: tutorials,
        },
      ],
    }).then((_) => {
      setMode('/list');
    });
  };

  const update_tutorial = (values, mark) => {
    updateTutorial({
      variables: {
        id: values.id,
        title: values.title,
        content: mark,
      },
      refetchQueries: [
        {
          query: tutorials,
        },
      ],
    }).then((_) => {
      setMode('/list');
    });
  };

  const delete_tutorial = (tutorial) => {
    deleteTutorial({
      variables: {
        id: tutorial.id,
      },
      refetchQueries: [
        {
          query: tutorials,
        },
      ],
    }).then((_) => {
      window.alert('Tutorial Deleted');
      setEditTutorial(null);
      setMode('/list');
    });
  };

  const modeChange = () => {
    if (mode === '/list') {
      setMode('/modify');
    } else {
      setMode('/list');
      setEditTutorial(null);
    }
  };
  useEffect(() => {
    if (editTutorial != null) {
      setMode('/modify');
    }
  }, [editTutorial]);

  return (
    <div style={{ height: '100%', width: '100vw' }}>
      {mode === '/list' && (
        <div style={{ paddingTop: '2vh', paddingLeft: '5vw', paddingRight: '5vw' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <a
              class="button"
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={() => modeChange()}
            >
              Create Tutorials <i class="ti-arrow-right"></i>
            </a>
          </div>

          {data ? (
            <TutorialList
              tutorials={data.tutorials}
              setEditTutorial={setEditTutorial}
              delete_tutorial={delete_tutorial}
            />
          ) : (
            <></>
          )}
        </div>
      )}
      {mode === '/modify' && (
        <div style={{ paddingTop: '2vh', paddingLeft: '5vw', paddingRight: '5vw' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <a
              class="button"
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={() => modeChange()}
            >
              Back <i class="ti-arrow-left"></i>
            </a>
          </div>
          <AddEditTutorial
            tutorial={editTutorial}
            create_tutorial={create_tutorial}
            update_tutorial={update_tutorial}
          />
        </div>
      )}
    </div>
  );
}
