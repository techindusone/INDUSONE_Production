import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

const initialValues = {
  userAuth: null,
  userData: null,
};

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
  const decodedUserData = JSON.parse(localStorage.getItem('userData'));
  // console.log('Log: Decoded Token: ', decodedToken)
  // console.log(decodedToken)
  // console.log('Log: Decoded User Data: ', decodedUserData)
  // console.log(decodedUserData)
  if (decodedToken.exp * 1000 < Date.now()) {
    window.alert('Expired Session!');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
  } else {
    initialValues.userAuth = decodedToken;
    initialValues.userData = decodedUserData;
  }
}

const AuthContext = createContext({
  user: null,
  userData: null,
  login: (userAuth) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        userAuth: action.payload.userAuth,
        userData: action.payload.userData,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        userAuth: null,
        userData: null,
      };
    }
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialValues);

  function login(userAuth) {
    localStorage.setItem('jwtToken', userAuth.token);
    localStorage.setItem('userData', JSON.stringify(userAuth.user));
    const userPayload = {
      userAuth: userAuth.token,
      userData: userAuth.user,
    };
    dispatch({
      type: 'LOGIN',
      payload: userPayload,
    });
  }

  function logout() {
    // console.log('Logging the user out')
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    dispatch({
      action: 'LOGOUT',
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.userAuth, userData: state.userData, login, logout }}
      {...props}
    />
  );
}

export { AuthProvider, AuthContext };
