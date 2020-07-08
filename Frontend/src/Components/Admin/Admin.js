import React from 'react';
import { Link } from 'react-router-dom';
import ProRoute from '../../Utils/ProRoute';
import ManageProblems from './Problems/ManageProblems';
import ManageStudents from './Students/ManageStudents';
import ManageBlogs from './Blogs/ManageBlogs';
import ManageTutorials from './Tutorials/ManageTutorials';
import OnlyDesktopSVG from '../../Assets/Images/onlyDesktop.svg';

export default function Admin() {
  return (
    <div
      style={{
        paddingTop: '10vh',
        height: '90vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div id="onlyDesktop">
        <img src={OnlyDesktopSVG} style={{ height: '20%' }} />{' '}
      </div>
      <div
        className="ui container fluid"
        style={{
          backgroundImage: 'linear-gradient(-90deg, #cc42eb, #3500ba)',
          paddingLeft: '5vw',
          paddingRight: '5vw',
          paddingBottom: '1rem',
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
                    Manage Users
                  </div>
                  <br />
                  <div
                    class="description"
                    style={{
                      fontFamily: 'Montserrat',
                      fontWeight: 500,
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    27 Users
                    <Link to="/admin/students" class="button btn-admin">
                      Manage<i class="ti-arrow-right"></i>
                    </Link>
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
                    Manage Tutorials
                  </div>
                  <br />
                  <div
                    class="description"
                    style={{
                      fontFamily: 'Montserrat',
                      fontWeight: 500,
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    127 Blogs
                    <Link to="/admin/tutorials" class="button btn-admin">
                      Manage<i class="ti-arrow-right"></i>
                    </Link>
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
                    Manage Problems
                  </div>
                  <br />
                  <div
                    class="description"
                    style={{
                      fontFamily: 'Montserrat',
                      fontWeight: 500,
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    120 Problems
                    <Link to="/admin/problems" class="button btn-admin">
                      Manage<i class="ti-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProRoute exact path="/admin/students" component={ManageStudents} />
      <ProRoute exact path="/admin/tutorials" component={ManageTutorials} />
      <ProRoute exact path="/admin/problems" component={ManageProblems} />
    </div>
  );
}
