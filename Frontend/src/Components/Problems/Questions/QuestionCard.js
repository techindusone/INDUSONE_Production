import React from 'react';
import { useHistory } from 'react-router-dom';

export default function QuestionCard(props) {
  const { problem } = props;
  // console.log(problem);
  const history = useHistory();
  const handleSubmit = (problem) => {
    history.push('/problems', { problem: problem });
  };

  return (
    <div>
      {problem ? (
        <div
          class="ui card"
          style={{ borderRadius: '0', width: '100%', boxShadow: '0 6px 20px -5px rgba(0,0,0,0.2)' }}
        >
          <div class="content">
            <div class="container">
              <div class="row">
                <div class="col-lg-9" style={{ marginBottom: '10px' }}>
                  <h1 style={{ paddingTop: '0px', paddingBottom: '-30px' }}>{problem.title}</h1>
                  <p style={{ fontWeight: '400' }}>
                    {' '}
                    <span style={{ color: '#7910ea' }}>{problem.difficulty}</span>, Success Rate:
                    91%, Score: 20{' '}
                  </p>
                </div>
                <div class="col-lg-3" style={{ marginTop: '15px', display: 'block' }}>
                  <a
                    class="button"
                    onClick={() => {
                      handleSubmit(problem);
                    }}
                    style={{
                      color: 'white',
                      cursor: 'pointer',
                      borderRadius: '0',
                      boxShadow: '0 8px 6px -6px #7971EA',
                    }}
                  >
                    Start Solving <i aria-hidden="true" class="icon angle right white"></i>
                  </a>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
