import React, { useState, useEffect, useContext } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import BlogImage1 from '../../Assets/Images/Blogs/Blogs_1.jpg';
import BlogImage2 from '../../Assets/Images/Blogs/Blogs_2.jpg';
import BlogImage3 from '../../Assets/Images/Blogs/Blogs_3.jpg';
import BlogImage4 from '../../Assets/Images/Blogs/Blogs_4.jpg';
import BlogImage5 from '../../Assets/Images/Blogs/Blogs_5.jpg';
import AddEditBlog from '../Admin/Blogs/AddEditBlog';
import { AuthContext } from '../../Context/AuthContext';

// const GET_BLOGS = gql`
//   query posts {
//     posts {
//       id
//       user {
//         id
//         username
//       }
//       title
//       description
//       dateCreated
//       image
//       comments {
//         id
//         title
//         user {
//           id
//           username
//           email
//         }
//         dateCreated
//       }
//       tags
//     }
//   }
// `;

// const SEARCH_BLOGS = gql`
//   query searchPosts($args: String!) {
//     searchPosts(arg: $arg) {
//       id
//       user {
//         id
//         username
//       }
//       title
//       description
//       dateCreated
//       image
//       comments {
//         id
//         title
//         user {
//           id
//           username
//           email
//         }
//         dateCreated
//       }
//       tags
//     }
//   }
// `;

const GET_POSTS_BY_PAGE = gql`
  query postsPage($page: Int!, $arg: String!) {
    postsPage(page: $page, arg: $arg) {
      page
      pages
      objects {
        id
        user {
          id
          username
        }
        title
        description
        dateCreated
        image
        comments {
          id
          user {
            id
            username
            email
          }
          dateCreated
        }
        tags
      }
    }
  }
`;

const CREATE_BLOG = gql`
  mutation createPost($title: String!, $description: String!, $tags: String) {
    createPost(title: $title, description: $description, tags: $tags) {
      post {
        id
      }
    }
  }
`;

const UPLOAD_POST_IMAGE = gql`
  mutation uploadFile($file: Upload!, $postId: String) {
    uploadFile(file: $file, postId: $postId) {
      success
    }
  }
`;

const UPDATE_BLOG = gql`
  mutation updatePost($id: String!, $title: String, $description: String, $tags: String) {
    updatePost(title: $title, description: $description, id: $id, tags: $tags) {
      post {
        id
      }
    }
  }
`;

const DELETE_BLOG = gql`
  mutation deletePost($postId: String!) {
    deletePost(postId: $postId) {
      result
    }
  }
`;

export default function Discussions() {
  const { userData } = useContext(AuthContext);
  // console.log('Log: Userdata on blogs page: ', userData);

  const history = useHistory();
  const handleSubmit = (post, index) => {
    history.push('/blog#' + post.id);
  };

  const [page, setPage] = useState(1);
  const [mode, setMode] = useState('LIST');
  const [isSearching, setIsSearching] = useState(false);
  const [searchArg, setSearchArg] = useState('');
  const [blog, setBlog] = useState();
  const [search, setSearch] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  var imageLoader = [BlogImage1, BlogImage2, BlogImage3, BlogImage4, BlogImage5];

  const [createBlogMutation, { createData }] = useMutation(CREATE_BLOG, {
    update(proxy, result) {
      // console.log(result);
      history.push('/blogs');
    },
    onError(err) {
      console.log('Error creating a new blog.', err);
    },
  });

  const [uploadPostImageMutation, { uploadData }] = useMutation(UPLOAD_POST_IMAGE, {
    update(proxy, result) {
      // console.log('Log: File upload result: ', result);
    },
    onError(err) {
      console.log('Error uploading post image: ', err);
    },
  });

  const [updateBlogMutation, { updateData }] = useMutation(UPDATE_BLOG, {
    update(proxy, result) {
      // console.log(result);
      history.push('/blogs');
    },
    onError(err) {
      console.log('Error updating a blog.', err);
    },
  });

  const createBlog = (values, tagData, image) => {
    // console.log('This is uploadimage: ', image);
    createBlogMutation({
      variables: {
        ...values,
        tags: tagData,
      },
      refetchQueries: [
        {
          query: GET_POSTS_BY_PAGE,
          variables: { page, arg: '' },
        },
      ],
    }).then((res) => {
      const postId = res.data.createPost.post.id;
      uploadPostImageMutation({
        variables: {
          file: image,
          postId,
        },
        refetchQueries: [
          {
            query: GET_POSTS_BY_PAGE,
            variables: { page },
          },
        ],
      }).then((_) => setMode('LIST'));
    });
  };

  const updateBlog = (values, tagData) => {
    updateBlogMutation({
      variables: {
        ...values,
        tags: tagData,
      },
      refetchQueries: [
        {
          query: GET_POSTS_BY_PAGE,
          variables: { page, arg: '' },
        },
      ],
    }).then((_) => {
      setMode('LIST');
    });
  };

  const { loading, postError, data } = useQuery(GET_POSTS_BY_PAGE, {
    variables: { page, arg: searchArg },
  });

  const incrementPage = () => {
    setPage((page) => page + 1);
  };

  const decrementPage = () => {
    setPage((page) => page - 1);
  };

  const onSearchChange = (e) => {
    if (e && e.target && e.target.value) {
      setSearchArg(e.target.value);
      setPage(1);
    } else {
      // console.log('Log: Suspect');
      setSearchArg('');
      setPage(1);
    }
  };

  if (data) {
    // console.log('Log: QueryData: Posts: ');
    data.postsPage.objects.sort(function (a, b) {
      return Date.parse(b.dateCreated) - Date.parse(a.dateCreated);
    });
  }

  // console.log('Posts Data');
  // console.log(data ? data.postsPage : 'No Data');
  if (data) {
    for (var i = 0; i < data.postsPage.objects.length; i++) {
      var tags = data.postsPage.objects[i].tags;
      if (typeof tags === 'string') {
        data.postsPage.objects[i].tags = tags.split(',');
        // console.log(data.postsPage.objects[i].tags);
      }
    }
  }

  const updateMode = (mode, blog) => {
    if (mode === 'LIST' || mode === 'CREATE') {
      setBlog(null);
    } else {
      setBlog(blog);
    }
    setMode(mode);
  };

  useEffect(() => {
    // console.log(window.location);
  }, []);

  const [deleteBlogElement, { deleteProblemtokenData }] = useMutation(DELETE_BLOG, {
    update(proxy, result) {
      // console.log('Log: Deleted blog successfully', result);
    },
    onError(err) {
      console.log('Log: Error deleting a blog', err);
    },
  });

  const deleteBlog = (blog) => {
    deleteBlogElement({
      variables: {
        postId: blog.id,
      },
      refetchQueries: [
        {
          query: GET_POSTS_BY_PAGE,
          variables: { page, arg: '' },
        },
      ],
    }).then((_) => {
      setDeleteModalOpen(false);
    });
  };

  return (
    <div style={{ height: '250vh', width: '100%', paddingTop: '12vh' }}>
      {mode === 'LIST' ? (
        <div
          className="ui container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70vw',
          }}
        >
          <div
            className="blogs_header"
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '1rem',
              
            }}
          >
            <div
              className="col-xs-12 pagination_div"
              id = "div_pagination"
              style={{
              
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <h2 style={{ fontFamily: 'Montserrat' }}>Blogs</h2>{' '}
              <div style={{order:'3'}}>
                <button
                  className={page == 1 ? 'ui button disabled pagination' : 'ui button pagination'}
                  onClick={decrementPage}
                >
                  {'<'}
                </button>
                <button className="ui button pagination">{page}</button>
                <button
                  className={
                    data && data.postsPage.objects.length == 10 ? 'ui button pagination' : 'ui button disabled pagination'
                  }
                  onClick={incrementPage}
                >
                  {'>'}
                </button>
              </div>
            </div>
            <a
              class="button hidePhone"
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={() => setMode('CREATE')}
            >
              Create More <i class="ti-arrow-right"></i>
            </a>
          </div>
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-8 col-sm-12 col-xs-12">
                {loading ? (
                  <div>Loading....</div>
                ) : postError ? (
                  <p>Errors {postError.message}</p>
                ) : (
                  data &&
                  data.postsPage.objects.length > 0 &&
                  data.postsPage.objects.map((post, index) => {
                    return (
                      <div class="single-recent-blog-post" key={index}>
                        <div class="thumb">
                          <img class="img-fluid" src={imageLoader[index % 5]} alt="" />
                          <h1 style={{ fontFamily: 'Montserrat' }}>{post.title}</h1>
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
                              {post.tags.length > 0 &&
                                post.tags.map((tag, index) => {
                                  return (
                                    <a
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
                              <i class="comments icon"></i>
                              {post.comments.length}
                            </div>
                          </div>
                          <div class="ui divider"></div>
                          {/* <ul class="thumb-info">
                                                <li><a href="#"><i class="ti-user"></i>   {post.user.username}</a></li>
                                                <li><a href="#"><i class="ti-notepad"></i>  <Moment format="Do MMMM YY">{post.dateCreated}</Moment></a></li>
                                                <li><a href="#"><i class="ti-themify-favicon"></i>  {post.comments.length} Comment{post.comments.length > 1 || post.comments.length === 0 ? 's' : ''}</a></li>
                                            </ul> */}
                        </div>
                        <div class="details">
                          <br />
                          {/* <a href="blog-details.html">
                                                <h3>{post.title}</h3>
                                            </a> */}
                          {/* <p class="tag-list-inline">Tag: <a href="#">travel</a>, <a href="#">life style</a>, <a href="#">technology</a>, <a href="#">fashion</a></p> */}
                          <p style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
                            {post.description}
                          </p>
                          {/* <a class="button" style={{color: 'white', cursor: 'pointer'}} onClick={() => {handleSubmit(post)}}>Read More <i class="ti-arrow-right"></i></a> */}
                        </div>
                        <br />
                        <button
                          class="button"
                          style={{ color: 'white', cursor: 'pointer' }}
                          onClick={() => {
                            handleSubmit(post, index);
                          }}
                        >
                          Read More <i class="ti-arrow-right"></i>
                        </button>
                        {userData.username === post.user.username ? (
                          <button
                            class="button"
                            style={{ color: 'white', cursor: 'pointer', marginLeft: '1rem' }}
                            onClick={() => updateMode('UPDATE', post)}
                          >
                            Update <i class="ti-arrow-right"></i>
                          </button>
                        ) : (
                          <> </>
                        )}
                        {userData.username === post.user.username ? (
                          <Modal
                            open={deleteModalOpen}
                            style={{
                              height: '20vh',
                              top: '50%',
                              left: '50%',
                              transform: 'translate3d(-50%, -50%, 0)',
                            }}
                            trigger={
                              <button
                                data-target="DeleteBlog"
                                className="button modal-trigger"
                                style={{ color: 'white', cursor: 'pointer', marginLeft: '1rem' }}
                                onClick={() => {
                                  setBlog(post);
                                  setDeleteModalOpen(true);
                                }}
                              >
                                Delete <i class="ti-arrow-right"></i>
                              </button>
                            }
                          >
                            <Header icon="archive" content="Confirm Delete Post?" />
                            <Modal.Content>
                              <p>Are you sure you want to delete this post?</p>
                            </Modal.Content>
                            <Modal.Actions>
                              <Button
                                color="red"
                                inverted
                                onClick={() => setDeleteModalOpen(false)}
                              >
                                <Icon name="remove" /> No
                              </Button>
                              <Button color="green" inverted onClick={() => deleteBlog(blog)}>
                                <Icon name="checkmark" /> Yes
                              </Button>
                            </Modal.Actions>
                          </Modal>
                        ) : (
                          <> </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              <div
                class="col-lg-4"
                style={{ display: 'flex', flexDirection: 'column', paddingLeft: '2vw' }}
              >
                <div style={{ paddingTop: '1rem', paddingBottom: '1.5rem' }}>
                  <div
                    className="search"
                    style={{
                      display: 'flex',
                      width: '90%',
                      justifyContent: 'space-between',
                      boxShadow: '0px 15px 45px -9px rgba(0,0,0,.2)',
                      borderRadius: '5px',
                      paddingLeft: '1.5rem',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    <input
                      className="blogSearch"
                      placeholder="Search here.."
                      value={searchArg}
                      onChange={onSearchChange}
                      style={{
                        width: '80%',
                        border: 'none',
                        backgroundImage: 'none',
                        backgroundColor: 'transparent',
                      }}
                    />
                    <div
                      className="search_action"
                      style={{
                        height: '100%',
                        padding: '1.15rem',
                        backgroundColor: '#F0F0F0',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      <i class="search icon"></i>
                    </div>
                  </div>
                </div>
                <div className="categories">
                  <h3 style={{ fontFamily: 'Montserrat' }}>Categories</h3>
                  <div
                    className="categoryTag"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Raleway',
                        fontWeight: 400,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        lineHeight: '22px',
                      }}
                    >
                      C++
                    </div>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>1</div>
                  </div>
                  <div className="ui divider"></div>
                  <div
                    className="categoryTag"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Raleway',
                        fontWeight: 400,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        lineHeight: '22px',
                      }}
                    >
                      DS ALGO
                    </div>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>1</div>
                  </div>
                  <div className="ui divider"></div>
                  <div
                    className="categoryTag"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Raleway',
                        fontWeight: 400,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        lineHeight: '22px',
                      }}
                    >
                      Python
                    </div>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>1</div>
                  </div>
                  <div className="ui divider"></div>
                  <div
                    className="categoryTag"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Raleway',
                        fontWeight: 400,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        lineHeight: '22px',
                      }}
                    >
                      Trees
                    </div>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>1</div>
                  </div>
                  <div className="ui divider"></div>
                  <div
                    className="categoryTag"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Raleway',
                        fontWeight: 400,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        lineHeight: '22px',
                      }}
                    >
                      Uncategorized
                    </div>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>1</div>
                  </div>
                </div>
                <br />
                <br />
                <div className="categories">
                  <h3 style={{ fontFamily: 'Montserrat' }}>Tags</h3>
                  <a
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
                    C++
                  </a>
                  <a
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
                    DS Algo
                  </a>
                  <a
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
                    Trees
                  </a>
                  <a
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
                    Python
                  </a>
                  <a
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
                    Javascript
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AddEditBlog
          mode={mode}
          setMode={updateMode}
          blog={blog}
          createBlog={createBlog}
          updateBlog={updateBlog}
        />
      )}
    </div>
  );
}
