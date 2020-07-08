import React from 'react';
import TopicCard from './TopicCard';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const problemStatements = gql`
  query {
    problemStatements {
      id
      title
      description
      topic
      difficulty
      content
      instream
      outstream
      timeConstraint
      spaceConstraint
      discussions {
        id
        student {
          name
          user {
            username
          }
        }
        title
        description
        createdDate
        updatedDate
      }
    }
  }
`;

const topicOptions = [
  {
    key: 1,
    text: 'Pointers',
    value: 'POINTERS',
  },
  {
    key: 2,
    text: 'Arrays',
    value: 'ARRAYS',
  },
  {
    key: 3,
    text: 'Strings',
    value: 'STRINGS',
  },
  {
    key: 4,
    text: 'HashMaps',
    value: 'HASHMAPS',
  },
  {
    key: 5,
    text: 'Sorting',
    value: 'SORTING',
  },
  {
    key: 6,
    text: 'Recursion',
    value: 'RECURSION',
  },
  {
    key: 7,
    text: 'Backtracking',
    value: 'BACKTRACKING',
  },
  {
    key: 8,
    text: 'Stack and Queues',
    value: 'STACKSANDQUEUES',
  },
  {
    key: 9,
    text: 'Linked Lists',
    value: 'LINKEDLISTS',
  },
  {
    key: 10,
    text: 'Trees',
    value: 'TREES',
  },
  {
    key: 11,
    text: 'Greedy',
    value: 'GREEDY',
  },
  {
    key: 12,
    text: 'Dynamic Programming',
    value: 'DYNAMICPROGRAMMING',
  },
  {
    key: 13,
    text: 'Graphs',
    value: 'GRAPHS',
  },
];

export default function TopicCardsList() {
  const { data, loading } = useQuery(problemStatements);
  var problemStatementsByTopic = {};
  if (data) {
    for (var i = 0; i < data.problemStatements.length; i++) {
      // console.log(data.problemStatements[i].title)
      if (problemStatementsByTopic[data.problemStatements[i].topic] == null) {
        problemStatementsByTopic[data.problemStatements[i].topic] = [];
      }
      problemStatementsByTopic[data.problemStatements[i].topic].push(data.problemStatements[i]);
    }
    // console.log(problemStatementsByTopic);
  }
  return (
    <>
      <div className="ui container fluid hidePhone " style={{ padding: 0, paddingTop: '10vh' }}>
        <div
          className="ui container fluid"
          style={{
            backgroundImage: 'linear-gradient(-90deg, #cc42eb, #3500ba)',
            paddingLeft: '5vw',
            paddingRight: '5vw',
          }}
        >
          <div class="ui three column grid">
            <div class="row">
              <div class="column">
                <div
                  className="ui fluid card"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    color: 'white',
                  }}
                >
                  <div class="content" style={{ color: 'white' }}>
                    <br />
                    <div class="header" style={{ fontFamily: 'Montserrat', color: 'white' }}>
                      Learnings from 1000+ Companies
                    </div>
                    <br />
                    <div
                      class="description"
                      style={{ fontFamily: 'Montserrat', fontWeight: 500, color: 'white' }}
                    >
                      We have carefully curated these challenges to help you prepare in the most
                      comprehensive way possible.
                    </div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div
                  className="ui fluid card"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    color: 'white',
                  }}
                >
                  <div class="content" style={{ color: 'white' }}>
                    <br />
                    <div class="header" style={{ fontFamily: 'Montserrat', color: 'white' }}>
                      Key Concepts
                    </div>
                    <br />
                    <div
                      class="description"
                      style={{ fontFamily: 'Montserrat', fontWeight: 500, color: 'white' }}
                    >
                      Challenges are organised around core concepts commonly tested during
                      Interviews.
                    </div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div
                  className="ui fluid card"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    color: 'white',
                  }}
                >
                  <div class="content" style={{ color: 'white' }}>
                    <br />
                    <div class="header" style={{ fontFamily: 'Montserrat', color: 'white' }}>
                      How to prepare
                    </div>
                    <br />
                    <div
                      class="description"
                      style={{ fontFamily: 'Montserrat', fontWeight: 500, color: 'white' }}
                    >
                      Try to solve as many challenges from this list as possible. If you are stuck,
                      use the Discussion and Editorial sections for hints and solutions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ paddingLeft: '5vw', paddingRight: '5vw', paddingTop: '10vh' }}>
        <div>
          <div class="ui column grid">
            <div class="row">
              {Object.keys(problemStatementsByTopic).map((topic) => {
                return (
                  <div class="col-lg-4" style={{ marginBottom: '20px' }}>
                    <TopicCard topic={topic} problemStatements={problemStatementsByTopic[topic]} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
