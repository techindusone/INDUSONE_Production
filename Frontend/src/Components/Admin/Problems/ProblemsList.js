import React from 'react';
import AdminProblemCard from './AdminProblemCard';

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

export default function ProblemsList({ problems, deleteProblem, setEditProblem }) {
  var problemStatements = [];
  var problemStatementsByTopic = {};

  if (problems) {
    problems.sort(function (a, b) {
      return Date.parse(b.createdDate) - Date.parse(a.createdDate);
    });
    for (var i = 0; i < problems.length; i++) {
      // console.log(problems[i].title)
      problemStatements.push(problems[i]);
      if (problemStatementsByTopic[problems[i].topic] == null) {
        problemStatementsByTopic[problems[i].topic] = [];
      }
      problemStatementsByTopic[problems[i].topic].push(problems[i]);
    }
    // console.log('Log: QueryData: Posts: ', )
  }
  return (
    <div class="col-lg-12" style={{ paddingLeft: '10vw', paddingRight: '10vw' }}>
      {' '}
      {problemStatements.map((problem) => {
        {
          /* console.log(problem) */
        }
        return (
          <div class="column" style={{ paddingTop: '2.5vh' }}>
            <div>
              <AdminProblemCard
                problem={problem}
                setEditProblem={setEditProblem}
                deleteProblem={deleteProblem}
              />
              <br />
            </div>
          </div>
        );
      })}{' '}
    </div>
  );
}
