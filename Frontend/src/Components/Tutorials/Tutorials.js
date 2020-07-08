import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import TutorialCard from './TutorialCard';

const GET_TUTORIALS = gql`
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

export default function Tutorials() {
  const { data, loading } = useQuery(GET_TUTORIALS);
  var TUTORIALS = [];
  // console.log(data);
  if (data) {
    // console.log(typeof(data.tutorials));

    for (var i = 0; i < data.tutorials.length; i++) {
      TUTORIALS.push(data.tutorials[i]);
    }
    // console.log(TUTORIALS);
  }

  return (
    <div>
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
              {data ? (
                TUTORIALS.map((tutorial) => {
                  return (
                    <div class="col-lg-4" style={{ marginBottom: '20px' }}>
                      <TutorialCard tutorial={tutorial} />
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
