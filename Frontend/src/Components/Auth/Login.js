import React, { useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../UiUtil/useForm';
import gql from 'graphql-tag';
import { AuthContext } from '../../Context/AuthContext';
import Loader from 'react-loader-spinner';
import MaterialDialog from '../UiUtil/MaterialDialog';
import homeSvg from '../../Assets/Images/home.svg';
import LinkedInLogo from '../../Assets/Images/Logos/linkedin.png';
import GoogleLogo from '../../Assets/Images/Logos/google.svg';
import { Link } from 'react-router-dom';
import GoogleButton from '../../Utils/SocialButtons/GoogleButton';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import Axios from 'axios';

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

const GET_TOKEN = gql`
  mutation tokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
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

export default function Login() {
  // const [error, setError] = useState({})
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, handleChange] = useForm({ email: '', password: '' });
  const context = useContext(AuthContext);
  // const [socialError, setSocialError] = useState(false)
  // const [clientToken, setClientToken] = useState('')

  useEffect(() => {
    // console.log('Login values changed');
    // console.log(values);
  });

  // const [getMe, {meLoading, meData}] = useLazyQuery(GET_ME)
  const [loginStudent] = useMutation(GET_TOKEN, {
    update(proxy, result) {
      // console.log('Success loggin in a student.');
      // console.log(result);
      context.login(result.data.tokenAuth);
      setLoading(false);
    },
    onError(err) {
      console.log('Error loggin in a student.', err);
      // setError(err)
      setOpenDialog(true);
    },
    variables: values,
  });

  const handleGoogleSuccess = (res) => {
    // console.log('Log: Google response: ', res);
    var gAccessToken = res._token.accessToken;
    // console.log('Log: Google Access Token from Google OAuth2: ', gAccessToken);
    // setClientToken(gAccessToken)
    socialAuthLogin(gAccessToken, 'google-oauth2');
  };

  const handleLinkedInSuccess = (res) => {
    // console.log(res);
    Axios.get('https://cors-anywhere.herokuapp.com/https://www.linkedin.com/oauth/v2/accessToken', {
      params: {
        grant_type: 'authorization_code',
        code: res.code,
        redirect_uri: 'http://industech-react.s3-website.us-east-2.amazonaws.com/linkedin',
        client_id: '77rf0paf3t1cew',
        client_secret: '9Y1KrJ3uDXGjqJhb',
      },
    }).then((res) => {
      // setClientToken(res.data.access_token)
      // console.log(res.data.access_token);
      Axios.get(
        'https://cors-anywhere.herokuapp.com/https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))',
        {
          headers: {
            authorization: 'Bearer ' + res.data.access_token,
          },
        },
      ).then((resData) => {
        // console.log('email Data');
        // console.log(resData);
        // console.log(resData.data.elements[0]['handle~'].emailAddress);
        // console.log('Log Getting Social JWT Token');
        socialAuthLoginLinkedIn(
          res.data.access_token,
          'linkedin-oauth2',
          resData.data.elements[0]['handle~'].emailAddress,
        );
      });
    });
  };

  const handleFailure = (res) => {
    // console.log(res);
  };

  const socialAuthLogin = async (clientToken, provider) => {
    getSocialAuth({
      variables: {
        accessToken: clientToken,
        provider: provider,
      },
    })
      .then((res) => {
        // console.log('TEST: SUCCESS:', res);
        var accessToken = res.data.socialAuth.token;
        // console.log('LOG: Set client token is: ', accessToken);
        context.login(res.data.socialAuth);
      })
      .catch((err) => {
        console.log('TEST: ERROR:', err);
      });
  };

  const socialAuthLoginLinkedIn = async (clientToken, provider, linkedInEmail) => {
    getSocialAuth({
      variables: {
        accessToken: clientToken,
        provider: provider,
        email: linkedInEmail,
      },
    })
      .then((res) => {
        // console.log('TEST: SUCCESS:', res);
        var accessToken = res.data.socialAuth.token;
        // console.log('LOG: Set client token is: ', accessToken);
        context.login(res.data.socialAuth);
      })
      .catch((err) => {
        console.log('TEST: ERROR:', err);
      });
  };

  const [getSocialAuth, { result }] = useMutation(SOCIAL_AUTH, {
    update(proxy, result) {
      // console.log('Success creating a new social student.');
      setLoading(false);
      // console.log('LOG: Social Auth Result: ', result);
    },
    onError(err) {
      console.log('Error creating a new social student.', err);
      // setError(err)
      // setSocialError(true)
      return 'Error';
      // setOpenDialog(true)
    },
  });

  const login = () => {
    setLoading(true);
    loginStudent();
  };

  return (
    <div
      id="registerBox"
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="col-lg-1 hidePhone" data-aos="fade-up" data-aos-delay="500"></div>
      <div className="col-lg-5 col-sm-12 hidePhone" data-aos="fade-up" data-aos-delay="500">
        <img src={homeSvg} alt="svg" style={{ height: '100%', width: '100%' }} class="img-fluid" />
      </div>
      <div className="col-lg-1 hidePhone" data-aos="fade-up" data-aos-delay="500"></div>

      <div
        className="col-lg-4 col-sm-10 col-10"
        data-aos="fade-up"
        data-aos-delay="500"
        style={{ boxShadow: '0px 15px 45px -9px rgba(0,0,0,.2)' }}
      >
        <form
          action=""
          method="post"
          class="form-box"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h3 class="h4 text-black mb-4">Log In</h3>
          <div class="form-group">
            <input
              type="text"
              style={{
                backgroundColor: '#F0F0F0',
                width: '100%',
                border: 0,
                borderBottom: '2px solid $gray',
                outline: 0,
                fontSize: '1.3rem',
                color: 'black',
                padding: '7px',
                paddingLeft: '0.75rem',
                transition: 'borderColor 0.2s',
              }}
              class="form-control"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              style={{
                backgroundColor: '#F0F0F0',
                width: '100%',
                border: 0,
                borderBottom: '2px solid $gray',
                outline: 0,
                fontSize: '1.3rem',
                color: 'black',
                padding: '7px',
                paddingLeft: '0.75rem',
                transition: 'borderColor 0.2s',
              }}
              class="form-control"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div
            class="form-group"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <input type="submit" class="btn btn-primary btn-pill" value="Log In" onClick={login} />
            <div>
              <a
                href="https://industech.herokuapp.com/password-reset"
                style={{
                  color: 'black',
                  fontWeight: 600,
                  textAlign: 'right',
                  fontFamily: 'Montserrat',
                }}
              >
                Forgot Password?
              </a>
            </div>
          </div>
          <br />
          <div
            class="form-group"
            style={{ display: 'flex', justifyContent: 'center', fontFamily: 'Montserrat' }}
          >
            <div>
              New User? Register <Link to="/register">here</Link>
            </div>
          </div>
          <br />
          <div class="ui horizontal divider" style={{ fontFamily: 'Montserrat' }}>
            or connect with
          </div>
          <br />
          <div
            className="social-auth-button-bar"
            style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}
          >
            <GoogleButton
              provider="google"
              appId="617458822048-dsd9o7g690vlqbis9fpej0dp0ful8b0h.apps.googleusercontent.com"
              onLoginSuccess={handleGoogleSuccess}
              onLoginFailure={handleFailure}
              key={'google'}
            >
              <img src={GoogleLogo} style={{ height: '6.5vh', cursor: 'pointer' }} alt="google" />
            </GoogleButton>
            <LinkedIn
              clientId="77rf0paf3t1cew"
              onSuccess={handleLinkedInSuccess}
              onFailure={handleFailure}
              redirectUri="http://industech-react.s3-website.us-east-2.amazonaws.com/linkedin"
              scope="r_liteprofile r_emailaddress w_member_social"
              renderElement={({ onClick, disabled }) => (
                <img
                  src={LinkedInLogo}
                  onClick={onClick}
                  style={{ height: '6.5vh', cursor: 'pointer' }}
                  alt="linkedin"
                />
              )}
            ></LinkedIn>
          </div>
          <br />
          {loading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <Loader type="Circles" color="#4F45E3" height={50} width={50} timeout={3000} />
            </div>
          )}
        </form>
      </div>
      <MaterialDialog open={openDialog} setOpen={setOpenDialog} msg={'Invalid EMail or Password'} />
      <div className="col-lg-1 hidePhone" data-aos="fade-up" data-aos-delay="500"></div>
    </div>
  );
}
