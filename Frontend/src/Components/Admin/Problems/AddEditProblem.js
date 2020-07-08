import React, { useState, useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ReactMarkdown from 'react-markdown';
import { Dropdown } from 'semantic-ui-react';

export default function AddEditProblem({ createProblem, updateProblem, problem }) {
  const [values, setValues] = useState({});
  const [mode, setMode] = useState('ADD');
  const [mark, setMark] = useState('');
  const [markdown, setMarkdown] = useState('# Enter Problem Statement');

  // useEffect(() => {

  // })

  useEffect(() => {
    setMarkdown(`\n\n# ${values.title ?? ''}\n\n## ${values.description ?? ''}\n\n${mark}`);
  }, [values, mark]);

  useEffect(() => {
    if (problem) {
      setValues({ ...problem });
      // console.log('Edit Problem')
      // console.log(problem)
      setMark(problem.content);
      setMode('UPDATE');
    }
  }, []);

  const dropOptions = [
    {
      key: 1,
      text: 'EASY',
      value: 'EASY',
    },
    {
      key: 2,
      text: 'MEDIUM',
      value: 'MEDIUM',
    },
    {
      key: 3,
      text: 'HARD',
      value: 'HARD',
    },
  ];

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

  const onFormChange = (event) => {
    if (event && event.target) setValues({ ...values, [event.target.name]: event.target.value });
  };

  const changeMarkdown = (e) => {
    if (e && e.target != null) {
      setMark(e.target.value);
    }
  };

  const makeProblem = async () => {
    // console.log('Log: Making Problem')
    // console.log(values)
    if (values.difficulty == null) window.alert('Enter Difficulty');
    else if (values.topic == null) window.alert('Enter Topic');
    else if (values.title == null || values.title.trim() === '') window.alert('Enter Title');
    else if (mark == null || mark.trim() === '') window.alert('Enter Content');
    else if (values.description == null || values.description.trim() === '')
      window.alert('Enter Description');
    else if (values.instream == null || values.instream.trim() === '')
      window.alert('Enter InStream');
    else if (values.outstream == null || values.outstream.trim() === '')
      window.alert('Enter OutStream');
    else if (mode === 'ADD') {
      await createProblem(values, mark);
      return <Redirect to="/admin" />;
    } else if (mode === 'UPDATE') {
      await updateProblem(values, mark);
      return <Redirect to="/admin" />;
    }
  };

  // console.log('Render Log: Markdown: ', markdown)
  // console.log('Render Log: Values: ', values)

  const onDifficultyChange = (e, { name, value }) => {
    setValues({ ...values, difficulty: value });
  };

  const onTopicChange = (e, { name, value }) => {
    setValues({ ...values, topic: value });
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
          <h3 class="h4 text-black mb-4">Create A problem</h3>
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
              rows="2"
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
              placeholder="Description"
              name="description"
              onChange={onFormChange}
              value={values.description ?? ''}
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
              placeholder="Time Limit (in ms)"
              name="timeConstraint"
              onChange={onFormChange}
              value={values.timeConstraint ?? ''}
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
              placeholder="Space Limit (in bytes)"
              name="spaceConstraint"
              onChange={onFormChange}
              value={values.spaceConstraint ?? ''}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <div class="form-group" style={{ width: '50%', paddingRight: '1rem' }}>
              <textarea
                rows="4"
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
                placeholder="InStream"
                name="instream"
                onChange={onFormChange}
                value={values.instream ?? ''}
              />
            </div>
            <div class="form-group" style={{ width: '50%' }}>
              <textarea
                rows="4"
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
                placeholder="OutStream"
                name="outstream"
                onChange={onFormChange}
                value={values.outstream ?? ''}
              />
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <div class="form-group">
              <input
                type="submit"
                class="btn btn-primary btn-pill"
                value={mode === 'ADD' ? 'Create' : 'Modify'}
                onClick={makeProblem}
              />
            </div>
            <div>
              <Dropdown
                placeholder="Topic"
                search
                selection
                options={topicOptions}
                onChange={onTopicChange}
                value={values.topic ?? null}
              />
              <Dropdown
                placeholder="Difficulty"
                search
                selection
                options={dropOptions}
                onChange={onDifficultyChange}
                value={values.difficulty ?? null}
              />
            </div>
          </div>
        </form>
      </div>
      <div style={{ height: '100%', width: '60%', color: 'black', padding: '3rem' }}>
        <ReactMarkdown source={markdown} escapeHtml={false} />
      </div>
    </div>
  );
}
