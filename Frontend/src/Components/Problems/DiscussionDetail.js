import React, { useContext } from 'react';
import Moment from 'react-moment';
import { Comment, CommentItem } from '../Blogs/Comment';
import { AuthContext } from '../../Context/AuthContext';

const DiscussionDetailCard = ({ discussion }) => {
  const { user, userData } = useContext(AuthContext);
  console.log('Log: Discussion Detail: ', discussion);
  // console.log(discussion.comments);
  return (
    <div
      className="ui card"
      style={{ borderRadius: '0', width: '100%', boxShadow: '0 6px 20px -5px rgba(0,0,0,0.2)' }}
    >
      <div className="content">
        <div className="row">
          <div className="col-lg-12" style={{}}>
            <h5
              style={{
                paddingTop: '0px',
                paddingBottom: '-30px',
                cursor: 'pointer',
                paddingLeft: '10px',
              }}
            >
              {discussion.title}
            </h5>
            <p style={{ fontWeight: '400', marginBottom: '20px', paddingLeft: '10px' }}>
              <span style={{ color: '#7910ea' }}>created by</span>
              {discussion.student.name}
              <Moment format="YYYY-MM-DD HH:mm">{discussion.createdDate}</Moment>
            </p>
            <p style={{ fontWeight: '400', padding: '10px' }}>{discussion.description}</p>
          </div>
        </div>
        <div className="container-fluid" style={{ marginTop: '100px' }}>
          {discussion.comments ? (
            <div>
              {discussion.comments.map((comment) => {
                return (
                  <CommentItem
                    comment={comment}
                    userData={userData}
                    discussion={discussion}
                    // updateCommentMutation={updateCommentMutation}
                    getCurrentPost={null}
                    // deleteCommentMutation={deleteCommentMutation}
                  />
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <Comment discussion={discussion} postId={null} getCurrentPost={null} />
    </div>
  );
};

export default DiscussionDetailCard;
