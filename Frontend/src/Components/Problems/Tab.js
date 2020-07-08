import React, { useState, useContext, useEffect } from 'react';
import { Tab } from 'semantic-ui-react';
import { Typography } from '@material-ui/core';
import ModalExampleCloseIcon from './Modal';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { AuthContext } from '../../Context/AuthContext';
import UserSubmissions from './Submissions/UserSubmissions';
import DiscussionCard from './DiscussionCard';
import DiscussionDetailCard from './DiscussionDetail';

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

export const GET_SUBMISSIONS = gql`
  query submissions($probId: String!) {
    submissions(probId: $probId) {
      code
      token
      timeTakenMillis
      spaceTakenBytes
      kind
      language
      stderr
      createdDate
      updatedDate
    }
  }
`;

const Tabs = ({ problem, index, setTabIndex }) => {
  const { user, userData, logout } = useContext(AuthContext);
  // console.log('user', user);
  // console.log('userData', userData);

  const [activeIndex, setActiveIndex] = useState(0);

  const id = problem.id;
  // console.log(id);
  const { data, loading } = useQuery(GET_DISCUSSIONS, {
    variables: {
      probId: id,
    },
  });

  const setIndex = (index) => {
    setActiveIndex(index);
  };

  const [mode, setMode] = useState('/list');
  const [detDiscussion, setDetDiscussion] = useState(null);

  useEffect(() => {
    if (detDiscussion != null) {
      setMode('/detail');
    }
  }, [detDiscussion]);

  useEffect(() => {
    if (data != null && detDiscussion != null) {
      console.log('Log: Discussions changed: ', detDiscussion.id);
      data.discussions.forEach((discussion) => {
        if (discussion.id == detDiscussion.id) setDetDiscussion(discussion);
      });
    }
  }, [data]);

  const modeChange = () => {
    if (mode === '/list') {
      setMode('/detail');
    } else {
      setMode('/list');
    }
  };

  const changeDiscussion = (discussion) => {
    modeChange();
    setDetDiscussion(discussion);
  };

  var discussions = [];

  if (data) {
    discussions = data.discussions;
  }

  discussions.sort(function (a, b) {
    return Date.parse(b.createdDate) - Date.parse(a.createdDate);
  });

  const panes = [
    {
      menuItem: 'Problem',
      render: () => (
        <Tab.Pane attached={false} style={{ boxShadow: 'None', border: 'None' }}>
          <div
            class="ui segment active tab"
            style={{
              marginBottom: '20px',
              borderRadius: '0px',
              boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)',
            }}
          >
            <Typography style={{ padding: '10px' }}>{problem.description}</Typography>
            <h5 style={{ marginLeft: '20px' }}>INPUT</h5>

            <div
              style={{
                marginLeft: '30px',
                backgroundColor: '#efefef',
                padding: '20px',
                margin: '20px',
              }}
            >
              {problem.instream}
            </div>

            <h5 style={{ marginLeft: '20px' }}>OUTPUT</h5>

            <div
              style={{
                marginLeft: '30px',
                backgroundColor: '#efefef',
                padding: '20px',
                margin: '20px',
              }}
            >
              {problem.outstream}
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Submissions',
      render: () => (
        <Tab.Pane
          attached={false}
          style={{ borderRadius: '0px', boxShadow: 'None', border: 'None' }}
        >
          <UserSubmissions problem={problem} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Discussions',
      render: () => (
        <Tab.Pane
          attached={false}
          style={{ borderRadius: '0px', boxShadow: 'None', border: 'None' }}
        >
          {console.log('Log: Discussions: ', discussions)}
          {mode === '/list' && (
            <div>
              <ModalExampleCloseIcon problem={problem} />
              {discussions ? (
                discussions.map((discussion) => {
                  return (
                    <DiscussionCard discussion={discussion} changeDiscussion={changeDiscussion} />
                  );
                })
              ) : (
                <></>
              )}
            </div>
          )}

          {mode === '/detail' && (
            <div>
              <a
                class="button"
                style={{ color: 'white', cursor: 'pointer' }}
                onClick={() => modeChange()}
              >
                Back <i class="ti-arrow-left"></i>
              </a>
              <DiscussionDetailCard discussion={detDiscussion} />
            </div>
          )}
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Tab
      menu={{ secondary: true, pointing: true }}
      panes={panes}
      activeIndex={index}
      onTabChange={(e, { activeIndex }) => {
        setTabIndex(activeIndex);
      }}
    />
  );
};

export default Tabs;
