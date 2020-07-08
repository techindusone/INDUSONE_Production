import React, { useState } from 'react';
import AceEditor from 'react-ace';
import {
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Button,
  Paper,
  Checkbox,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-lisp';
import 'ace-builds/src-noconflict/mode-php';
// import 'ace-builds/src-noconflict/mode-swift'
// import 'ace-builds/src-noconflict/mode-dart'
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-ruby';
import { useMutation } from '@apollo/react-hooks';
import Loader from 'react-loader-spinner';
import { useLocation, Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import Tabs from './Tab';
import useJudge, { useSubmission, timeout, useJudgeTest } from '../../Utils/useJudge.js';
import LanguageConfig from '../../Utils/Variables';
import { GET_SUBMISSIONS } from './Submissions/UserSubmissions';
import OnlyDesktopSVG from '../../Assets/Images/onlyDesktop.svg';

const judgeErrors = {
  1: 'In Queue',
  2: 'Processing',
  3: 'Accepted',
  4: 'Wrong Answer',
  5: 'Time Limit Exceeded',
  6: 'Compilation Error',
  7: 'Runtime Error (SIGSEGV)',
  8: 'Runtime Error (SIGXFSZ)',
  9: 'Runtime Error (SIGFPE)',
  10: 'Runtime Error (SIGABRT)',
  11: 'Runtime Error (NZEC)',
  12: 'Runtime Error (Other)',
  13: 'Internal Error',
  14: 'Exec Format Error',
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const CREATE_SUBMISSION_ON_DB = gql`
  mutation createSubmission(
    $code: String!
    $kind: String!
    $stdout: String!
    $token: String!
    $timeTakenMillis: String!
    $spaceTakenBytes: String!
    $problemStatementId: String!
    $language: String!
  ) {
    createSubmission(
      code: $code
      kind: $kind
      stdout: $stdout
      token: $token
      timeTakenMillis: $timeTakenMillis
      spaceTakenBytes: $spaceTakenBytes
      problemStatementId: $problemStatementId
      language: $language
    ) {
      submission {
        id
      }
    }
  }
`;

export default function ProblemInterface() {
  const location = useLocation();
  let problem = null;
  const classes = useStyles();
  const [language, setLanguage] = React.useState('C++');
  const [tabIndex, setTabIndex] = useState(0);
  const [code, setCode] = useState(() => LanguageConfig['C++'].boiler);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [test, setTest] = useState(null);
  const [customInputFlag, setCustomInputFlag] = useState(false);
  const handleChange = (event) => {
    setLanguage(event.target.value);
    setCode(LanguageConfig[event.target.value].boiler);
  };

  const [createSubmission, { createSubmissionTokenData }] = useMutation(CREATE_SUBMISSION_ON_DB, {
    update(proxy, result) {
      // console.log('Log: Created a new submission successfully', result);
    },
    onError(err) {
      console.log('Log: Error creating a new submission', err);
    },
  });

  if (location.state) {
    problem = location.state.problem;
  } else {
    return <Redirect to="/topics" />;
  }

  // console.log('Log: Problem loadded as: ', problem);

  const [stdin, setStdin] = useState(problem.instream);
  // problemStatement = useQuery(GET_PROBLEM);

  async function _submitCode(problem) {
    setLoadingSubmission(true);
    setTest(null);
    const lId = LanguageConfig[language].languageId;
    const expectedOutput = problem.outstream;
    const token = await useJudge({ code, lId, stdin: problem.instream, expectedOutput });
    if (!token) {
      // Error Submitting
    }
    // console.log(token);
    // Lan purposes ***Remove in production***
    await timeout(5000);
    const response = await useSubmission(token.token);
    // console.log('Response');
    // console.log(response);
    setSubmission((subm) => ({
      language_id: response.language_id,
      status_id: response.status_id,
      stdin: response.stdin,
      stdout: response.stdout,
      stderr: response.stderr,
      memory: response.memory,
      source_code: response.source_code,
      time: response.time,
    }));
    await createSubmission({
      variables: {
        code: response.source_code,
        kind: response.status_id + response.stderr,
        token,
        stdout: response.stdout ?? '',
        timeTakenMillis: response.time ?? '0',
        spaceTakenBytes: response.memory ?? '0',
        problemStatementId: problem.id,
        language: response.language_id,
      },
      refetchQueries: [
        {
          query: GET_SUBMISSIONS,
          variables: {
            probId: problem.id,
          },
        },
      ],
    });
    if (response.status_id != 3) window.alert(judgeErrors[response.status_id]);
    setLoadingSubmission(false);
    setTabIndex(1);
    window.scrollTo(0, 0);
  }

  async function _testCode(problem) {
    setLoadingSubmission(true);
    const lId = LanguageConfig[language].languageId;
    // const expectedOutput = problem.outstream;
    var input = customInputFlag ? stdin : problem.instream;
    // console.log('Log: Input: ', input);
    // console.log('Log: InStream: ', problem.instream);
    // console.log('Log: Custom Input: ', stdin);
    const token = await useJudgeTest({ code, lId, stdin: input });
    if (!token) {
      // Error Submitting
    }
    // console.log(token);
    // Lan purposes ***Remove in production***
    await timeout(5000);
    const response = await useSubmission(token.token);
    // console.log('Response');
    // console.log(response);
    if (response.status_id != 3) {
      window.alert(judgeErrors[response.status_id]);
      setLoadingSubmission(false);
      setTest(null);
      return;
    }
    setTest((subm) => ({
      language_id: response.language_id,
      status_id: response.status_id,
      stdin: response.stdin,
      stdout: response.stdout,
      stderr: response.stderr,
      memory: response.memory,
      source_code: response.source_code,
      time: response.time,
    }));
    setLoadingSubmission(false);
  }

  function onAceChange(value) {
    setCode((c) => value);
  }

  function handleStdinChange(event) {
    if (event.target) setStdin(event.target.value);
  }

  // console.log(problem);
  return (
    <>
      <div style={{ width: '100%', fontFamily: 'Montserrat' }}>
        <div id="onlyDesktop">
          <img src={OnlyDesktopSVG} style={{ height: '20%' }} />{' '}
        </div>
        {problem ? (
          <>
            {loadingSubmission && (
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
            <div
              className="flex_problem"
              style={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'center',
                // height: '100vh',
                width: '100%',
                paddingTop: '5vh',
              }}
            >
              <div
                className="interface_problem"
                style={{
                  // height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '5vh',
                  paddingLeft: '2.5vw',
                  paddingRight: '2.5vw',
                  marginBottom: '10vh',
                }}
              >
                <div className="interface_problem_descriptionbox">
                  <div className="problem_description_index">
                    <div className="row">
                      <div className="col-lg-9 col-xs-12">
                        <div
                          className="meta"
                          style={{
                            fontWeight: '400',
                            marginBottom: '-20px',
                            fontFamily: 'Montserrat',
                          }}
                        >
                          {'Problems >'}
                          {problem.topic}
                          {'>'}
                          {problem.title}
                        </div>
                        <h1
                          className=""
                          style={{
                            fontSize: '30px',
                            marginBottom: '15px',
                            fontFamily: 'Montserrat',
                          }}
                        >
                          {problem.title}
                        </h1>
                      </div>
                      <div className="col-lg-3 col-xs-12">
                        <div className="meta" style={{ fontWeight: '400', marginBottom: '-20px' }}>
                          {' '}
                          Topic
                        </div>
                        <a
                          className="hoverTag"
                          id="hoverTag"
                          style={{
                            textTransform: 'uppercase',
                            padding: '0 12px',
                            borderRadius: '5px',
                            boxShadow: 'none',
                            borderWidth: '0',
                            lineHeight: '32px',
                            backgroundColor: '#F0F0F0',
                            display: 'inline-block',
                            fontSize: '13px',
                            fontWeight: 700,
                            fontFamily: 'Montserrat',
                            cursor: 'pointer',
                            marginTop: '25px',
                            marginRight: '10px',
                          }}
                        >
                          {problem.topic}
                        </a>
                        {/* <a classname='hoverTag' id='hoverTag' style={{ textTransform: 'uppercase', padding: '0 12px', borderRadius: '5px', boxShadow: 'none', borderWidth: '0', lineHeight: '32px', backgroundColor: '#F0F0F0', display: 'inline-block', fontSize: '13px', fontWeight: 700, fontFamily: 'Montserrat', cursor: 'pointer', marginTop: "25px" }}>Two pointers</a> */}
                      </div>
                    </div>
                  </div>
                  <div className="problem_description_statement" />
                </div>
                <div>
                  <Tabs problem={problem} index={tabIndex} setTabIndex={setTabIndex} />
                </div>
                <div
                  className="interface_programming"
                  style={{
                    boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)',
                    marginBottom: '10px',
                    margin: 'auto',
                    fontFamily: 'Source Code Pro',
                  }}
                >
                  <AceEditor
                    theme="terminal"
                    mode={LanguageConfig[language].aceMode}
                    height="60vh"
                    width="65vw"
                    fontSize={17}
                    defaultValue={LanguageConfig[language].boiler}
                    value={code}
                    onChange={onAceChange}
                    id="react-ace"
                  />
                </div>
                <div
                  className="interface_control"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Checkbox
                      checked={customInputFlag}
                      onChange={() => setCustomInputFlag((c) => !c)}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    <Typography>Custom Input</Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                      style={{
                        backgroundColor: '#7971ea',
                        color: 'white',
                        borderRadius: '0px',
                        marginRight: '10px',
                      }}
                      onClick={() => _testCode(problem)}
                      variant="contained"
                    >
                      Test
                    </Button>
                    {customInputFlag ? (
                      <Button
                        style={{
                          backgroundColor: '#EEEEEE',
                          color: 'white',
                          borderRadius: '0px',
                          marginRight: '10px',
                        }}
                        disabled={customInputFlag}
                        onClick={() => _submitCode(problem)}
                        variant="contained"
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        style={{
                          backgroundColor: '#7971ea',
                          color: 'white',
                          borderRadius: '0px',
                          marginRight: '10px',
                        }}
                        disabled={customInputFlag}
                        onClick={() => _submitCode(problem)}
                        variant="contained"
                      >
                        Submit
                      </Button>
                    )}
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-simple-select-label">Language</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={language}
                        onChange={handleChange}
                      >
                        {Object.keys(LanguageConfig).map(function (key, index) {
                          return (
                            <MenuItem value={key} key={LanguageConfig[key].languageId}>
                              {key}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                {customInputFlag && (
                  <div className="">
                    <TextField
                      id="standard-multiline-flexible"
                      label="Custom Input"
                      multiline
                      rows="4"
                      variant="outlined"
                      value={stdin}
                      onChange={handleStdinChange}
                    />
                  </div>
                )}
                {!test && (
                  <div
                    style={{
                      marginTop: '1vh',
                      display: 'flex',
                      width: '100%',
                      paddingTop: '10vh',
                      paddingBottom: '10vh',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontSize: '2.25rem',
                      boxShadow: '0 6px 20px -5px rgba(0,0,0,0.2)',
                      backgroundColor: '#F1F1F1',
                    }}
                  >
                    <div>Run a test to see results here</div>
                    <div style={{ paddingTop: '1rem', fontSize: '1.25rem' }}>
                      Click{' '}
                      <span
                        onClick={() => {
                          setTabIndex(1);
                          window.scrollTo(0, 0);
                        }}
                        style={{ color: 'blue', fontSize: '1.25rem', cursor: 'pointer' }}
                      >
                        here
                      </span>{' '}
                      to see all submissions
                    </div>
                  </div>
                )}
                {test && !loadingSubmission && (
                  <div
                    style={{
                      marginTop: '1vh',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      paddingTop: '1vh',
                      paddingBottom: '1vh',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '2.25rem',
                      boxShadow: '0 6px 20px -5px rgba(0,0,0,0.2)',
                      backgroundColor: '#F1F1F1',
                    }}
                  >
                    <div
                      className="interface_submission"
                      style={{ width: '100%', paddingTop: '1rem', paddingLeft: '1.75rem' }}
                    >
                      <Typography>
                        {test.stderr ? (
                          <span className="interface_submission_error">
                            Error Compiling:
                            {test.stderr}
                          </span>
                        ) : (
                          <span className="interface_submission_success">Success Compiling</span>
                        )}
                        <br />
                        Your Submission took {test.time}
                        ms & {test.memory} bytes <br />
                      </Typography>
                    </div>
                    <div
                      className="interface_results"
                      style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ padding: '1.75rem', width: '100%' }}>
                        <TextField
                          id="standard-multiline-flexible"
                          label="Std Input"
                          multiline
                          disabled
                          fullWidth
                          style={{ width: '100%' }}
                          rows="4"
                          variant="outlined"
                          value={test.stdin}
                        />
                      </div>
                      <div style={{ padding: '1.75rem', width: '100%' }}>
                        <TextField
                          id="standard-multiline-flexible"
                          label="Std Output"
                          multiline
                          disabled
                          style={{ width: '100%' }}
                          rows="4"
                          fullWidth
                          variant="outlined"
                          value={test.stdout}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                className="interface_problem_progress"
                style={{ width: '40%', display: 'flex', marginTop: '200px' }}
              >
                <div className="container">
                  <h3 style={{}}>Similar Problems</h3>
                  <div className="row">
                    <div
                      className="col-lg-12"
                      style={{ display: 'block', margin: 'auto', marginBottom: '10px' }}
                    >
                      <a
                        className="ui card"
                        style={{ boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)', border: 'None' }}
                        href="#card-example-link-card"
                      >
                        <div className="content">
                          <div className="header">3 Sum</div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-lg-12"
                      style={{ display: 'block', margin: 'auto', marginBottom: '10px' }}
                    >
                      <a
                        className="ui card"
                        style={{ boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)', border: 'None' }}
                        href="#card-example-link-card"
                      >
                        <div className="content">
                          <div className="header">3 Sum Zero</div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-lg-12"
                      style={{ display: 'block', margin: 'auto', marginBottom: '10px' }}
                    >
                      <a
                        className="ui card"
                        style={{ boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)', border: 'None' }}
                        href="#card-example-link-card"
                      >
                        <div className="content">
                          <div className="header">Container with most water</div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-lg-12"
                      style={{ display: 'block', margin: 'auto', marginBottom: '10px' }}
                    >
                      <a
                        className="ui card"
                        style={{ boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)', border: 'None' }}
                        href="#card-example-link-card"
                      >
                        <div className="content">
                          <div className="header">4 Sum</div>
                        </div>
                      </a>
                    </div>
                  </div>
                  {/* <h3>Latest Submissions</h3> */}
                  {/* <div className="row">
                  <div className="col-lg-12" style={{display:"block",margin:"auto",marginBottom:"10px"}}>
                    <a className="ui card" style={{boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)',border:"solid #c10000 1.5px",borderRadius:"0px"}} href="#card-example-link-card">
                      <div className="content">
                        <div className="header" style={{color:"#c10000"}}>Terminated due to...</div>
                      </div>
                    </a>
                  </div>
                  <div className="col-lg-12" style={{display:"block",margin:"auto",marginBottom:"10px"}}>
                    <a className="ui card" style={{boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)',border:"solid #21ec27 1.5px",color:"#9dfba0",borderRadius:"0px"}} href="#card-example-link-card">
                      <div className="content">
                        <div className="header" style={{color:"#21ec27"}}>Accepted</div>
                      </div>
                    </a>
                  </div>
                </div> */}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>
      <footer class="footer-section bg-black" style={{ marginTop: '10vh' }}>
        <div class="container">
          <div class="row">
            <div class="col-md-4">
              <h3 style={{ color: 'white' }}>About IndusOne</h3>
              <p style={{ color: 'grey' }}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro consectetur ut hic
                ipsum et veritatis corrupti. Itaque eius soluta optio dolorum temporibus in, atque,
                quos fugit sunt sit quaerat dicta.
              </p>
            </div>

            <div class="col-md-3 ml-auto">
              <h3 style={{ color: 'white' }}>Links</h3>
              <ul class="list-unstyled footer-links">
                <li>
                  <a href="#home-section" style={{ color: '#7971ea' }}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#teachers-section" style={{ color: '#7971ea' }}>
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#programs-section" style={{ color: '#7971ea' }}>
                    Problems
                  </a>
                </li>
                <li>
                  <a href="sensive/index.html" style={{ color: '#7971ea' }}>
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div class="col-md-4" style={{ color: 'white' }}>
              <h3 style={{ color: 'white' }}>Subscribe</h3>
              <p style={{ color: 'grey' }}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt incidunt iure
                iusto architecto? Numquam, natus?
              </p>
              <form action="#" class="footer-subscribe">
                <div class="d-flex mb-3">
                  <input
                    type="text"
                    style={{ maxWidth: 350 }}
                    class="form-control rounded-0"
                    placeholder="Email"
                  />
                </div>
                <input
                  type="submit"
                  style={{ maxWidth: 350 }}
                  class="btn btn-primary btn-lg rounded-0"
                  value="Subscribe"
                />
              </form>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
