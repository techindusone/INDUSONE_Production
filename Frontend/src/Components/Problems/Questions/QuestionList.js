import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import { useLocation, Redirect } from 'react-router-dom';
import OnlyDesktopSVG from '../../../Assets/Images/onlyDesktop.svg';
export default function QuestionCardsList() {
  const location = useLocation();
  const [filters, setFilters] = useState([]);
  var problemStatements;
  if (location.state) {
    problemStatements = location.state.problemStatements;
  } else {
    return <Redirect to="/topics"></Redirect>;
  }

  const handleFilterChange = (difficultyFilter) => {
    if (filters.includes(difficultyFilter)) {
      setFilters(filters.filter((filter) => filter !== difficultyFilter));
    } else {
      setFilters([...filters, difficultyFilter]);
    }
  };

  // console.log(problemStatements);
  return (
    <>
      <div id="onlyDesktop">
        <img src={OnlyDesktopSVG} style={{ height: '20%' }} />{' '}
      </div>
      <div className="ui container fluid" style={{ padding: 0, paddingTop: '10vh' }}>
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
        <div style={{ display: 'flex' }}>
          <div class="col-lg-9">
            {Object.keys(problemStatements).map((problem) => {
              return filters.includes(problemStatements[problem].difficulty) ||
                filters.length == 0 ? (
                <div class="column" style={{ paddingTop: '2.5vh' }}>
                  <div>
                    <QuestionCard problem={problemStatements[problem]} />
                    <br />
                  </div>
                </div>
              ) : (
                <></>
              );
            })}
          </div>
          <div class="col-lg-3" style={{ height: '100%' }}>
            <div class="ui container" style={{ padding: '1px', marginBottom: '20px' }}>
              <h5 style={{ color: '#7971ea' }}>DIFFICULTY</h5>

              <input
                style={{ marginRight: '5px' }}
                name="EASY"
                type="checkbox"
                class="hidden"
                readonly=""
                tabindex="0"
                onChange={() => handleFilterChange('EASY')}
                checked={filters.includes('EASY')}
              />
              <label style={{ fontSize: '17px', fontWeight: '400' }}> EASY</label>
              <br />
              <input
                style={{ marginRight: '5px' }}
                name="MEDIUM"
                type="checkbox"
                class="hidden"
                readonly=""
                tabindex="0"
                onChange={() => handleFilterChange('MEDIUM')}
                checked={filters.includes('MEDIUM')}
              />
              <label style={{ fontSize: '17px', fontWeight: '400' }}> MEDIUM</label>
              <br />
              <input
                style={{ marginRight: '5px' }}
                name="HARD"
                type="checkbox"
                class="hidden"
                readonly=""
                tabindex="0"
                onChange={() => handleFilterChange('HARD')}
                checked={filters.includes('HARD')}
              />
              <label style={{ fontSize: '17px', fontWeight: '400' }}> HARD</label>
            </div>
            {/* <div class ="ui container"  style={{padding:"1px"}}  >
                                        <h5 style={{color:"#7971ea"}} >STATUS</h5>
                                        <input style={{marginRight:"5px"}}  type="checkbox" class="hidden" readonly="" tabindex="0" checked/>
                                        <label style={{fontSize:"17px",fontWeight:"400"}}  > SOLVED</label><br/>
                                        <input style={{marginRight:"5px"}}  type="checkbox" class="hidden" readonly="" tabindex="0" />
                                        <label style={{fontSize:"17px",fontWeight:"400"}} > ATTEMPTED</label><br/>
                                        <input style={{marginRight:"5px"}}  type="checkbox" class="hidden" readonly="" tabindex="0" />
                                        <label style={{fontSize:"17px",fontWeight:"400"}} > TO DO</label>
                                    </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
