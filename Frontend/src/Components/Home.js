import React, { useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Background from '../Assets/Images/whiteback.png';
import CodeSVG from '../Assets/Images/code.svg';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import GoogleLogo from '../Assets/Images/Logos/google.svg';
import GoogleButton from '../Utils/SocialButtons/GoogleButton';
import gql from 'graphql-tag';

const SOCIAL_AUTH = gql`
  mutation socialAuth($accessToken: String!, $provider: String!, $email: String) {
    socialAuth(provider: $provider, accessToken: $accessToken, email: $email) {
      social {
        provider
        user {
          id
          email
          username
        }
      }
      token
      user {
        id
        email
        username
        firstName
        lastName
        dateJoined
        lastLogin
        isStudent
        isStaff
        isStartup
        isSuperuser
      }
    }
  }
`;

export default function Home() {
  const { user, login } = useContext(AuthContext);

  const [getSocialAuth, { result }] = useMutation(SOCIAL_AUTH, {
    update(proxy, result) {
      // console.log('Success creating a new social student.')
      // setLoading(false)
      // console.log('LOG: Social Auth Result: ', result)
    },
    onError(err) {
      console.log('Error creating a new social student.', err);
      // setError(err)
      // setSocialError(true)
      return 'Error';
      // setOpenDialog(true)
    },
  });

  const socialAuthLogin = async (clientToken, provider) => {
    getSocialAuth({
      variables: {
        accessToken: clientToken,
        provider: provider,
      },
    })
      .then((res) => {
        // console.log('TEST: SUCCESS:', res)
        // var accessToken = res.data.socialAuth.token
        // console.log('LOG: Set client token is: ', accessToken)
        login(res.data.socialAuth);
      })
      .catch((err) => {
        console.log('TEST: ERROR:', err);
      });
  };
  return (
    <>
      <div
        style={{
          height: '90vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Montserrat',
        }}
      >
        <div
          class="slide-1"
          style={{ backgroundColor: 'white' }}
          data-stellar-background-ratio="0.5"
        >
          <div class="container">
            <div class="row align-items-center">
              <div class="col-12">
                {/* <GoogleButton
                            provider='google'
                            appId='617458822048-dsd9o7g690vlqbis9fpej0dp0ful8b0h.apps.googleusercontent.com'
                            onLoginSuccess={handleGoogleSuccess}
                            onLoginFailure={handleFailure}
                            key={'google'}
                            >
                                <img src={GoogleLogo} style={{height: '6.5vh', cursor: 'pointer'}} alt='google' />
                        </GoogleButton> */}
                <div class="row align-items-center">
                  <div class="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                    <img
                      src={CodeSVG}
                      alt="svg"
                      style={{ height: '80%', width: '100%' }}
                      className="hidePhone img-fluid"
                    />
                  </div>
                  <div class="col-1" style={{ marginBottom: 50 }}></div>
                  <br />
                  <br />
                  <div class="col-lg-5 mb-4">
                    <h1
                      data-aos="fade-up"
                      data-aos-delay="100"
                      style={{ color: 'black', fontFamily: 'Montserrat' }}
                    >
                      Industech Services
                    </h1>
                    <p
                      class="mb-4"
                      data-aos="fade-up"
                      data-aos-delay="200"
                      style={{ color: 'grey' }}
                    >
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime ipsa nulla sed
                      quis rerum amet natus quas necessitatibus.
                    </p>
                    {!user ? (
                      <div class="row">
                        <div class="col-3 form-group" style={{ marginRight: 50, width: '100%' }}>
                          <Link to="/login">
                            <input
                              type="submit"
                              class="btn btn-primary btn-lg btn-pill"
                              value="Log In"
                            />
                          </Link>
                        </div>
                        <div class="col-3 form-group">
                          <Link to="/register">
                            <input type="submit" class="btn btn-primary btn-pill" value="Sign up" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <> </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
