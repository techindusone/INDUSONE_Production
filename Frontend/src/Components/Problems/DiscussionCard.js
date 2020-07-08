import React from 'react';
import Moment from 'react-moment';
import UpdateModal from './updateModal';
import { Button } from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../../Context/AuthContext';
import { useContext } from 'react';

const GET_DISCUSSIONS = gql`
  query discussions($probId: String!) {
    discussions(probId: $probId) {
      id
      title
      description
      student {
        name
        user {
          username
        }
      }
      problemStatement {
        id
      }
      comments {
        id
        body
        user {
          username
        }
        dateCreated
      }
      createdDate
      updatedDate
    }
  }
`;

const DELETE_DISCUSSION = gql`
  mutation deleteDiscussion($id: String) {
    deleteDiscussion(id: $id) {
      success
    }
  }
`;

const DiscussionCard = (props) => {
  const { discussion, changeDiscussion } = props;
  const [deleteDiscussion] = useMutation(DELETE_DISCUSSION);
  const { userData } = useContext(AuthContext);
  const deleteDis = () => {
    deleteDiscussion({
      variables: {
        id: discussion.id,
      },
      refetchQueries: [
        {
          query: GET_DISCUSSIONS,
          variables: {
            probId: discussion.problemStatement.id,
          },
        },
      ],
    });
  };
  return (
    <div
      class="ui card"
      style={{
        borderRadius: '0',
        width: '100%',
        boxShadow: '0 6px 20px -5px rgba(0,0,0,0.2)',
      }}
    >
      <div class="content">
        <div class="row">
          <div class="col-lg-8" style={{}}>
            <h5
              style={{
                paddingTop: '0px',
                paddingBottom: '-30px',
                cursor: 'pointer',
              }}
              onClick={() => changeDiscussion(discussion)}
            >
              {discussion.title}
            </h5>
            <p style={{ fontWeight: '400' }}>
              {' '}
              <span style={{ color: '#7910ea' }}>created by</span>: {discussion.student.name},{' '}
              <Moment format="YYYY-MM-DD HH:mm">{discussion.createdDate}</Moment>{' '}
            </p>
          </div>
          {discussion.student.user.username == userData.username ? (
            <div class="col-lg-4">
              <UpdateModal probId={discussion.problemStatement.id} discussion={discussion} />
              <Button
                style={{
                  right: '0',
                  backgroundColor: '#7971ea',
                  color: 'white',
                  cursor: 'pointer',
                  borderRadius: '50px',
                }}
                onClick={deleteDis}
              >
                Delete <i aria-hidden="true" class="icon angle right white"></i>
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
