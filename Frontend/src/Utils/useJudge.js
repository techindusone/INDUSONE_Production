import Axios from 'axios';

export default function useJudge({ code, lId, stdin, expectedOutput }) {
  return Axios.post(
    'http://18.225.10.32:3000/submissions/',
    {
      source_code: code,
      language_id: lId,
      stdin: stdin,
      expected_output: expectedOutput,
    },
    {
      headers: {
        'X-Auth-Token': '',
        'Content-Type': 'application/json',
      },
    },
  )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log('Error from judge: ', err);
    });
}

export function useJudgeTest({ code, lId, stdin }) {
  return Axios.post(
    'http://18.225.10.32:3000/submissions/',
    {
      source_code: code,
      language_id: lId,
      stdin: stdin,
    },
    {
      headers: {
        'X-Auth-Token': '',
        'Content-Type': 'application/json',
      },
    },
  )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log('Error from judge: ', err);
    });
}

export function useSubmission(token) {
  return Axios.get(
    'http://18.225.10.32:3000/submissions/' +
      token +
      '?fields=stdin,stdout,stderr,status_id,language_id,source_code,time,memory',
    {
      headers: {
        'X-Auth-Token': '',
        'Content-Type': 'application/json',
      },
    },
  )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log('Error from judge: ', err);
    });
}

export function timeout(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
