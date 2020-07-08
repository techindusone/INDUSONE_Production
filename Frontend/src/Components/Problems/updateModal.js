import React, { useState, useContext } from 'react';
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Moment from 'react-moment';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { GET_DISCUSSIONS } from './Modal';

const UPDATE_DISCUSSION = gql`
  mutation updateDiscussion($id: String, $title: String, $description: String) {
    updateDiscussion(id: $id, title: $title, description: $description) {
      discussion {
        title
        description
      }
    }
  }
`;

// const GET_DISCUSSIONS = gql`
//   query discussions($probId: String!) {
//     discussions(probId: $probId) {
//       id
//       title
//       description
//       student {
//         name
//         user {
//           username
//         }
//       }
//       comments {
//         id
//         body
//         user {
//           username
//         }
//         dateCreated
//       }
//       createdDate
//       updatedDate
//     }
//   }
// `;

const UpdateModal = ({ probId, discussion }) => {
  // console.log(probId);
  // console.log(discussion);
  const { user, userData, logout } = useContext(AuthContext);
  const [values, setValues] = useState({
    title: discussion.title,
    description: discussion.description,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [updateDiscussionMutation] = useMutation(UPDATE_DISCUSSION);
  const handleChange = (e) => {
    e.preventDefault();
    // console.log(e);
    if (e && e.target) {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    }
    console.log(values);
  };

  const handleSubmit = () => {
    updateDiscussionMutation({
      variables: {
        title: values.title,
        description: values.description,
        id: discussion.id,
      },
      refetchQueries: [
        {
          query: GET_DISCUSSIONS,
          variables: {
            probId: probId,
          },
        },
      ],
    }).then((_) => {
      setModalOpen(false);
    });
  };

  return (
    <Modal
      as={Form}
      open={modalOpen}
      trigger={
        <Button
          style={{
            right: '0',
            backgroundColor: '#7971ea',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '50px',
          }}
          onClick={() => setModalOpen(true)}
        >
          Update <i aria-hidden="true" class="icon angle right white"></i>
        </Button>
      }
      closeIcon
    >
      {/* <Header icon='archive' content='Archive Old Messages' /> */}
      <Modal.Content>
        <form
          action=""
          method="post"
          style={{ marginTop: '100px' }}
          class="form-box"
          onSubmit={(e) => {}}
        >
          <h3 class="h4 text-black mb-4">Update Discussion</h3>

          <div class="form-group">
            <input
              type="text"
              style={{
                backgroundColor: '#F0F0F0',
                width: '100%',
                border: 0,
                borderBottom: '2px solid $gray',
                outline: 0,
                fontSize: '1.3rem',
                color: 'black',
                padding: '7px',
                paddingLeft: '0.75rem',
                transition: 'borderColor 0.2s',
              }}
              class="form-control"
              placeholder="Title"
              name="title"
              onChange={handleChange}
              value={values.title}
            />
          </div>
          <div class="form-group">
            <textarea
              type="text"
              style={{
                backgroundColor: '#F0F0F0',
                width: '100%',
                border: 0,
                borderBottom: '2px solid $gray',
                outline: 0,
                fontSize: '1.3rem',
                color: 'black',
                padding: '7px',
                paddingLeft: '0.75rem',
                transition: 'borderColor 0.2s',
              }}
              class="form-control"
              placeholder="Description"
              name="description"
              onChange={handleChange}
              value={values.description}
            />
          </div>
          <div class="form-group">
            <input
              type="submit"
              onClick={handleSubmit}
              class="btn btn-primary btn-pill"
              style={{
                color: 'white',
                cursor: 'pointer',
                borderRadius: '50px',
                boxShadow: '0 8px 6px -6px #7971EA',
                marginRight: '10px',
              }}
              value="Update"
            />
            <input
              type="submit"
              onClick={() => setModalOpen(false)}
              class="btn btn-primary btn-pill"
              style={{
                color: 'white',
                cursor: 'pointer',
                borderRadius: '50px',
                boxShadow: '0 8px 6px -6px #7971EA',
              }}
              value="Back"
            />
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default UpdateModal;
