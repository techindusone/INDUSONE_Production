import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Dropdown } from 'semantic-ui-react';
import { useLocation, Redirect } from 'react-router-dom';

const AddEditTutorial = ({ create_tutorial, update_tutorial, tutorial }) => {
  const [values, setValues] = useState({});
  const [mode, setMode] = useState('ADD');
  const [mark, setMark] = useState('');
  const [markdown, setMarkdown] = useState('# Enter Content');

  useEffect(() => {
    setMarkdown(`\n\n# ${values.title ?? ''}\n\n## ${values.description ?? ''}\n\n${mark}`);
  }, [values, mark]);

  useEffect(() => {
    if (tutorial) {
      setValues({ ...tutorial });
      console.log('Edit Problem');
      // console.log(problem)
      setMark(tutorial.content);
      setMode('UPDATE');
    }
  }, []);

  const onFormChange = (event) => {
    if (event && event.target) setValues({ ...values, [event.target.name]: event.target.value });
    // console.log(values);
  };

  const changeMarkdown = (e) => {
    if (e && e.target != null) {
      setMark(e.target.value);
    }
  };

  const makeTutorial = async () => {
    if (mode === 'ADD') {
      await create_tutorial(values, mark);
      return <Redirect to="/admin" />;
    } else if (mode === 'UPDATE') {
      await update_tutorial(values, mark);
      return <Redirect to="/admin" />;
    }
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100vw',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ height: '100%', width: '40%' }}>
        <form
          action=""
          method="post"
          class="form-box"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h3 class="h4 text-black mb-4">Create A Tutorial</h3>
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
              placeholder="Title"
              name="title"
              onChange={onFormChange}
              value={values.title ?? ''}
            />
          </div>

          <div class="form-group">
            <textarea
              type="text"
              rows="6"
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
              placeholder="Content Markdown"
              name="content"
              onChange={changeMarkdown}
              value={mark ?? ''}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          ></div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div class="form-group">
              <input
                type="submit"
                class="btn btn-primary btn-pill"
                value={mode === 'ADD' ? 'Create' : 'Modify'}
                onClick={makeTutorial}
              />
            </div>
          </div>
        </form>
      </div>
      <div
        style={{
          height: '100%',
          width: '60%',
          color: 'black',
          padding: '3rem',
        }}
      >
        <ReactMarkdown source={markdown} escapeHtml={false} />
      </div>
    </div>
  );
};

export default AddEditTutorial;
