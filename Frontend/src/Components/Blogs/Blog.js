import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import Moment from 'react-moment';
import gql from 'graphql-tag';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import Loader from 'react-loader-spinner';
import { AuthContext } from '../../Context/AuthContext';
import { Comment, CommentItem } from './Comment';
// import Comment from './Comment';
// const GET_BLOG = gql`
//   query posts($postId: String!) {
//     post(postId: $postId) {
//       id
//       title
//       description
//       image
//       tags
//       user {
//         username
//       }
//       dateCreated
//       comments {
//         id
//         title
//         body
//         dateCreated
//       }
//     }
//   }
// `;

const CREATE_COMMENT = gql`
  mutation createComment($body: String!, $postId: String) {
    createComment(body: $body, postId: $postId) {
      comment {
        id

        user {
          id
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

const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: String!) {
    deleteComment(id: $commentId) {
      result
    }
  }
`;

export default function Blog() {
  const location = useLocation();
  const URL = location.pathname + location.hash;
  const [post, setPost] = useState();
  const [currentComment, setCurrentComment] = useState();
  const [comments, setComments] = useState([]);
  const { user, userData } = useContext(AuthContext);
  // console.log(userData.username);

  const getCurrentPost = () => {
    Axios({
      url: 'https://industech.herokuapp.com/graphql',
      method: 'post',
      data: {
        query: `
        query posts {
          post(postId: "${URL.split('#')[1].trim()}") {
            id
            title
            description
            image
            tags
            user {
              username
            }
            dateCreated
            comments {
              id
              body
              dateCreated
              user{
                username
              }
            }
          }
        }
          `,
      },
    }).then((result) => {
      result.data.data.post.tags = result.data.data.post.tags.split(',');

      setPost(result.data.data.post);
      // console.log(result.data.data.post);
    });
  };

  useEffect(() => {
    getCurrentPost();
  }, []);

  const [createComment] = useMutation(CREATE_COMMENT, {
    update(proxy, result) {
      // console.log(result);
      var newComment = result.data.createComment.comment;
      setComments([
        ...comments,
        {
          id: newComment.id,

          user: newComment.user,
          dateCreated: newComment.dateCreated,
        },
      ]);
    },
    onError(err) {
      console.log('Error creating a new student.', err);
    },
  });

  const [updateCommentMutation] = useMutation(UPDATE_COMMENT);

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT, {
    update(proxy, result) {
      // console.log(result);
      var newComment = result.data.createComment.comment;
      setComments([
        ...comments,
        {
          id: newComment.id,
          user: newComment.user,
          dateCreated: newComment.dateCreated,
        },
      ]);
    },
    onError(err) {
      console.log('Error creating a new student.', err);
    },
  });

  const deleteComment = (commentId) => {
    deleteCommentMutation({ variables: { commentId: commentId } });
  };

  const commentChange = (e) => {
    if (e && e.target) setCurrentComment(e.target.value);
  };

  const addComment = () => {
    createComment();
    setCurrentComment('');
  };

  return (
    <>
      {post == null ? (
        <div
          style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader
            type="Circles"
            color="#7971EA"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : (
        <div style={{ paddingTop: '10vh' }}>
          <div
            class="container-fluid"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <div class="col-lg-8 col-sm-12 col-xs-12" style={{ width: '100%' }}>
              <div class="single-recent-blog-post">
                <div class="thumb">
                  <img
                    class="img-fluid"
                    src="https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/dogs_1280p_0.jpg?itok=cnRk0HYq"
                    alt=""
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      paddingLeft: 0,
                    }}
                  >
                    <h1 style={{ fontFamily: 'Montserrat' }}>{post.title}</h1>
                    <div>
                      <button className="btn" style={{ padding: '0.5rem', cursor: 'default' }}>
                        Share
                      </button>
                      <button className="btn" style={{ padding: '0.5rem' }}>
                        <FacebookShareButton
                          url={
                            'http://industech-react.s3-website.us-east-2.amazonaws.com/blog#' +
                            post.id
                          }
                          children={<span class="ti-facebook" style={{ height: '10rem' }}></span>}
                        />
                      </button>
                      <button className="btn" style={{ padding: '0.5rem' }}>
                        <TwitterShareButton
                          url={
                            'http://industech-react.s3-website.us-east-2.amazonaws.com/blog#' +
                            post.id
                          }
                          children={<span class="ti-twitter"></span>}
                        />
                      </button>
                    </div>
                  </div>
                  <div
                    className="post-meta"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <div
                      className="postmeta-lead"
                      style={{ fontFamily: 'Montserrat', fontWeight: '400' }}
                    >
                      by {post.user.username}{' '}
                      <Moment format="MMMM Do, YYYY">{post.dateCreated}</Moment>
                    </div>
                    <div className="postmeta-trail" style={{ color: '#505050' }}>
                      {post.tags.length > 0 && (
                        <>
                          <label
                            style={{
                              textTransform: 'uppercase',
                              padding: '0 12px',
                              borderRadius: '5px',
                              boxShadow: 'none',
                              borderWidth: '0',
                              lineHeight: '32px',
                              backgroundColor: '#F0F0F0',
                              display: 'inline-block',
                              marginRight: '10px',
                              marginBottom: '12px',
                              fontSize: '13px',
                              fontWeight: 700,
                              fontFamily: 'Montserrat',
                              cursor: 'pointer',
                            }}
                          >
                            Tags
                          </label>{' '}
                          {post.tags.map((tag, index) => {
                            return (
                              <a
                                onClick={() => removeTag(tag)}
                                classname="hoverTag"
                                id="hoverTag"
                                style={{
                                  textTransform: 'uppercase',
                                  padding: '0 12px',
                                  borderRadius: '5px',
                                  boxShadow: 'none',
                                  borderWidth: '0',
                                  lineHeight: '32px',
                                  backgroundColor: '#F0F0F0',
                                  display: 'inline-block',
                                  marginRight: '10px',
                                  marginBottom: '12px',
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  fontFamily: 'Montserrat',
                                  cursor: 'pointer',
                                }}
                              >
                                {tag}
                              </a>
                            );
                          })}
                        </>
                      )}
                      <i class="comments icon"></i>
                      {post.comments.length}
                    </div>
                  </div>
                  <div class="ui divider"></div>
                </div>
                <div class="details">
                  <br />
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
                    {post.description}
                  </p>
                </div>
                <br />
              </div>
              <div>
                {post.comments ? (
                  <div>
                    {post.comments.map((comment) => {
                      return (
                        <CommentItem
                          comment={comment}
                          userData={userData}
                          updateCommentMutation={updateCommentMutation}
                          getCurrentPost={getCurrentPost}
                          deleteCommentMutation={deleteCommentMutation}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <Comment
                createComment={createComment}
                postId={post.id}
                getCurrentPost={getCurrentPost}
              />
            </div>
          </div>

          <footer class="footer-section bg-black">
            <div class="container">
              <div class="row">
                <div class="col-md-4">
                  <h3 style={{ color: 'white' }}>About IndusOne</h3>
                  <p style={{ color: 'grey' }}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro consectetur ut
                    hic ipsum et veritatis corrupti. Itaque eius soluta optio dolorum temporibus in,
                    atque, quos fugit sunt sit quaerat dicta.
                  </p>
                </div>

                <div class="col-md-3 ml-auto">
                  <h3 style={{ color: 'white' }}>Links</h3>
                  <ul class="list-unstyled footer-links">
                    <li>
                      <a href="#home-section" style={{ color: '#7971ea' }}>
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#teachers-section" style={{ color: '#7971ea' }}>
                        Tutorials
                      </a>
                    </li>
                    <li>
                      <a href="#programs-section" style={{ color: '#7971ea' }}>
                        Problems
                      </a>
                    </li>
                    <li>
                      <a href="sensive/index.html" style={{ color: '#7971ea' }}>
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="col-md-4" style={{ color: 'white' }}>
                  <h3 style={{ color: 'white' }}>Subscribe</h3>
                  <p style={{ color: 'grey' }}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt incidunt iure
                    iusto architecto? Numquam, natus?
                  </p>
                  <form action="#" class="footer-subscribe">
                    <div class="d-flex mb-3">
                      <input
                        type="text"
                        style={{ maxWidth: 350 }}
                        class="form-control rounded-0"
                        placeholder="Email"
                      />
                    </div>
                    <input
                      type="submit"
                      style={{ maxWidth: 350 }}
                      class="btn btn-primary btn-lg rounded-0"
                      value="Subscribe"
                    />
                  </form>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
