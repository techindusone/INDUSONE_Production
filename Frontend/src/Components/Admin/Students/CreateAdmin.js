import React, { useState } from 'react';
import { useForm } from '../../UiUtil/useForm';
import Loader from 'react-loader-spinner';

export default function CreateAdmin({ createAdmin, setMode }) {
  const [values, handleChange] = useForm({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // console.log('Log: Creating an admin with: ', values);
    if (values.password != values.confirmPassword) {
      window.alert('Passwords do not match!');
      return;
    }
    if (values.password.length < 8) {
      window.alert('Password should be at least 8 characters long');
      return;
    }
    setLoading(true);
    createAdmin({
      email: values.email,
      password: values.password,
      username: values.username,
    });
  };

  return (
    <div class="container">
      {loading && (
        <div
          style={{
            height: '100vh',
            width: '100%',
            position: 'fixed',
            zIndex: '100000000000000000',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader type="Circles" color="#7971EA" height={100} width={100} />
        </div>
      )}
      <div class="row">
        <div
          className="blogs_header"
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: '1rem',
          }}
        >
          <a
            class="button"
            style={{ color: 'white', cursor: 'pointer' }}
            onClick={() => setMode('LIST')}
          >
            Back <i class="ti-arrow-left"></i>
          </a>
        </div>
        <div
          className="col-lg-12 col-sm-10 col-10"
          data-aos="fade-up"
          data-aos-delay="500"
          style={{ boxShadow: '0px 15px 45px -9px rgba(0,0,0,.2)', marginTop: '100px' }}
        >
          <form
            action=""
            method="post"
            class="form-box"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h3 class="h4 text-black mb-4">Create Admin</h3>
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
                value={values.email}
                onChange={handleChange}
              />
            </div>
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
                placeholder="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
              />
            </div>
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
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
            </div>
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
                placeholder="Confirm Password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div
              class="form-group"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '2.5vh',
              }}
            >
              <input
                type="submit"
                class="btn btn-primary btn-pill"
                value="Create"
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
