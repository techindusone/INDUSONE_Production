import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { Dropdown } from 'semantic-ui-react';
import MUIDrawer from '../UiUtil/MUIDrawer';
import MenuIcon from '@material-ui/icons/Menu';

export default function Navbar() {
  const { user, userData, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (anchor, open) => {
    setOpen(open);
  };

  const setDrawer = () => {
    // console.log('Log Open: ', open)
    if (open) toggleDrawer('right', false);
    else toggleDrawer('right', true);
  };

  // console.log(user.username);
  return (
    <>
      <MUIDrawer toggleDrawer={toggleDrawer} open={open} />
      <header class="site-navbar py-4 js-sticky-header site-navbar-target" role="banner">
        <div class="container-fluid" style={{ fontWeight: 600, fontFamily: 'Montserrat' }}>
          <div class="d-flex align-items-center">
            <div class="site-logo mr-auto w-25">
              <Link to="/">IndusOne</Link>
            </div>

            {user ? (
              <div class="mx-auto text-center">
                <nav class="site-navigation position-relative text-right" role="navigation">
                  <ul class="site-menu main-menu js-clone-nav mx-auto d-none d-lg-block  m-0 p-0">
                    <li>
                      <Link to="/home" class="nav-link">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/problems" class="nav-link" style={{ color: 'black' }}>
                        Problems
                      </Link>
                    </li>
                    <li>
                      <Link to="/blogs" class="nav-link">
                        Blogs
                      </Link>
                    </li>
                    {userData.isSuperuser ? (
                      <li>
                        <Link to="/admin" class="nav-link">
                          Admin
                        </Link>
                      </li>
                    ) : (
                      <> </>
                    )}
                  </ul>
                </nav>
              </div>
            ) : (
              <> </>
            )}

            {user ? (
              <ul
                class="site-menu js-clone-nav d-lg-block m-0 p-0 hideDesktop"
                style={{ marginRight: '0px!important' }}
              >
                <li>
                  <div class="nav-link" onClick={() => setDrawer()}>
                    <MenuIcon />
                  </div>
                </li>
              </ul>
            ) : (
              <> </>
            )}

            {!user ? (
              <div class="ml-auto w-25 hidePhone">
                <nav class="site-navigation position-relative text-right" role="navigation">
                  <ul class="site-menu main-menu site-menu-dark js-clone-nav mr-auto d-none d-lg-block m-0 p-0">
                    <li class="cta">
                      <a class="nav-link" href="#here">
                        <span>Contact Us</span>
                      </a>
                    </li>
                  </ul>
                </nav>
                <a
                  class="d-inline-block d-lg-none site-menu-toggle js-menu-toggle text-black float-right"
                  href="#here"
                >
                  <span class="icon-menu h3"></span>
                </a>
              </div>
            ) : (
              <div class="ml-auto w-25 hidePhone">
                <nav class="site-navigation position-relative text-right" role="navigation">
                  <Dropdown text={'Hi ' + userData.username}>
                    <Dropdown.Menu style={{ color: '#7971EA' }}>
                      {/* <Dropdown.Item style={{color: '#7971EA', paddingTop: '1rem'}} onClick={logout} href='/profile' text='My Profile'/> */}
                      <Dropdown.Item
                        style={{ color: '#7971EA', paddingTop: '1rem' }}
                        href="/profile"
                        text="My Profile"
                      />
                      <Dropdown.Item
                        style={{ color: '#7971EA', paddingTop: '1rem' }}
                        onClick={logout}
                        href="/"
                        text="Logout"
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
