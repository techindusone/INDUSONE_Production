import React, { useState, useEffect, useContext, useQuery } from 'react';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import { useMutation } from 'react-apollo';

const CREATE_COMMENT = gql`
  mutation createComment($body: String!, $postId: String, $discussionId: String) {
    createComment(body: $body, postId: $postId, discussionId: $discussionId) {
      comment {
        id
        body
        user {
          username
        }
        dateCreated
      }
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation updateComment($body: String!, $id: String!) {
    updateComment(body: $body, id: $id) {
      result
    }
  }
`;

export const GET_DISCUSSIONS = gql`
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
      comments {
        id
        body
        user {
          username
        }
        dateCreated
      }
      problemStatement {
        id
      }
      createdDate
      updatedDate
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: String!) {
    deleteComment(id: $commentId) {
      result
    }
  }
`;

export const Comment = ({ postId, getCurrentPost, discussion }) => {
  const [createComment] = useMutation(CREATE_COMMENT);
  const [body, setBody] = useState('');
  const changeBody = (e) => {
    setBody(e.target.value);
    // console.log(body);
  };
  const create = (e) => {
    e.preventDefault();
    if (getCurrentPost != null) {
      createComment({
        variables: {
          body: body,
          postId: postId,
        },
      }).then((_) => {
        getCurrentPost();
      });
    } else {
      createComment({
        variables: {
          discussionId: discussion.id,
          body: body,
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
    }
    setBody('');
  };
  return (
    <div className="container-fluid" style={{ marginTop: '50px' }}>
      <form method="post" onSubmit={create}>
        <div>
          <textarea
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#fafafa',
              border: 'none',
              borderRadius: '5px',
            }}
            value={body}
            onChange={changeBody}
            placeholder="Post a comment"
          />
        </div>

        <button
          type="submit"
          style={{ marginTop: '10px', marginBottom: '30px' }}
          class="button submit_btn"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export const CommentItem = ({ comment, userData, getCurrentPost, discussion }) => {
  const [updateCommentMutation] = useMutation(UPDATE_COMMENT);
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT);
  const [modUpdate, setModUpdate] = useState('no');
  const changeModUpdate = () => {
    if (modUpdate == 'no') {
      setModUpdate('yes');
    } else {
      setModUpdate('no');
    }
  };
  const [body, setBody] = useState(comment.body);

  const changeBody = (e) => {
    setBody(e.target.value);
    // console.log(body);
  };
  const submitBody = () => {
    if (getCurrentPost != null) {
      updateCommentMutation({
        variables: {
          id: comment.id,
          body: body,
        },
      }).then((_) => {
        getCurrentPost();
      });
    } else {
      updateCommentMutation({
        variables: {
          id: comment.id,
          body: body,
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
    }
    setModUpdate('no');
  };
  const deleteItem = () => {
    if (getCurrentPost != null) {
      deleteCommentMutation({
        variables: { commentId: comment.id },
      }).then((_) => {
        getCurrentPost();
      });
    } else {
      deleteCommentMutation({
        variables: { commentId: comment.id },
        refetchQueries: [
          {
            query: GET_DISCUSSIONS,
            variables: {
              probId: discussion.problemStatement.id,
            },
          },
        ],
      });
    }
  };

  return (
    <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div class="user  " style={{ marginBottom: '20px', display: 'flex' }}>
        <div class="thumb">
          <img
            src=""
            alt=""
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50px',
              marginRight: '20px',
              backgroundColor: 'black',
            }}
          />
        </div>
        <div class="desc">
          <h5>
            <a href="#" style={{ color: '#7971ea' }}>
              {comment.user.username}
            </a>
          </h5>
          <p class="date" style={{ fontSize: '90%', marginTop: '-10px' }}>
            <Moment format="MMMM Do, YYYY">{comment.dateCreated}</Moment>
          </p>
          {modUpdate === 'no' ? (
            <p class="comment">{comment.body}</p>
          ) : (
            <div>
              <textarea
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#fafafa',
                  border: 'none',
                  borderRadius: '5px',
                }}
                value={body}
                onChange={changeBody}
              />
            </div>
          )}
        </div>
      </div>
      {userData.username === comment.user.username ? (
        <div class="reply-btn">
          {modUpdate === 'no' ? (
            <button
              type="submit"
              style={{
                marginTop: '10px',
                background: 'transparent',
                color: '#7971ea',
                border: 'none',
                marginRight: '-20px',
              }}
              onClick={changeModUpdate}
              class="button "
            >
              EDIT
            </button>
          ) : (
            <button
              type="submit"
              style={{
                marginTop: '10px',
                background: 'transparent',
                color: '#7971ea',
                border: 'none',
                marginRight: '-20px',
              }}
              onClick={submitBody}
              class="button "
            >
              UPDATE
            </button>
          )}

          <button
            type="submit"
            style={{
              marginTop: '10px',
              background: 'transparent',
              color: '#7971ea',
              border: 'none',
            }}
            class="button submit_btn"
            onClick={deleteItem}
          >
            DELETE
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Comment;
