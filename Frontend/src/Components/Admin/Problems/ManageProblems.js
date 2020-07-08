import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ProblemsList from './ProblemsList';
import AddEditProblem from './AddEditProblem';
import gql from 'graphql-tag';

const GET_PROBLEM_STATEMENTS = gql`
  query {
    problemStatements {
      id
      title
      description
      topic
      difficulty
      content
      instream
      outstream
      timeConstraint
      spaceConstraint
      createdDate
    }
  }
`;

const DELETE_PROBLEM_STATEMENT = gql`
  mutation deleteProblemStatement($id: String!) {
    deleteProblemStatement(id: $id) {
      success
    }
  }
`;

const UPDATE_PROBLEM_STATEMENT = gql`
  mutation updateProblemStatement(
    $id: String!
    $title: String
    $description: String
    $content: String
    $difficulty: _Difficulty
    $topic: _Topic
    $inStream: String
    $outStream: String
    $timeConstraint: String
    $spaceConstraint: String
  ) {
    updateProblemStatement(
      id: $id
      title: $title
      content: $content
      description: $description
      difficulty: $difficulty
      topic: $topic
      instream: $inStream
      outstream: $outStream
      timeConstraint: $timeConstraint
      spaceConstraint: $spaceConstraint
    ) {
      problemStatement {
        id
      }
    }
  }
`;

const CREATE_PROBLEM_STATEMENT = gql`
  mutation createProblemStatement(
    $title: String!
    $description: String!
    $content: String!
    $difficulty: Difficulty!
    $topic: Topic!
    $inStream: String!
    $outStream: String!
    $timeConstraint: String!
    $spaceConstraint: String!
  ) {
    createProblemStatement(
      title: $title
      content: $content
      description: $description
      difficulty: $difficulty
      topic: $topic
      instream: $inStream
      outstream: $outStream
      timeConstraint: $timeConstraint
      spaceConstraint: $spaceConstraint
    ) {
      problemStatement {
        id
        topic
      }
    }
  }
`;

export default function ManageProblems() {
  const [mode, setMode] = useState('/list');
  const [editProblem, setEditProblem] = useState(null);

  const { data, loading } = useQuery(GET_PROBLEM_STATEMENTS);

  const [createProblemStatement, { createProblemtokenData }] = useMutation(
    CREATE_PROBLEM_STATEMENT,
    {
      update(proxy, result) {
        // console.log('Log: Created a new problem successfully', result)
      },
      onError(err) {
        console.log('Log: Error creating a new problem', err);
      },
    },
  );

  const [updateProblemStatement, { updateProblemTokenData }] = useMutation(
    UPDATE_PROBLEM_STATEMENT,
    {
      update(proxy, result) {
        // console.log('Log: Updated the problem successfully', result)
      },
      onError(err) {
        console.log('Log: Error updating the problem', err);
      },
    },
  );

  const createProblem = (values, mark) => {
    createProblemStatement({
      variables: {
        id: values.id,
        title: values.title,
        description: values.description,
        content: mark,
        difficulty: values.difficulty,
        topic: values.topic,
        inStream: values.instream,
        outStream: values.outstream,
        timeConstraint: values.timeConstraint,
        spaceConstraint: values.spaceConstraint,
      },
      refetchQueries: [
        {
          query: GET_PROBLEM_STATEMENTS,
        },
      ],
    }).then((_) => {
      setMode('/list');
    });
  };

  const updateProblem = (values, mark) => {
    updateProblemStatement({
      variables: {
        id: values.id,
        title: values.title,
        description: values.description,
        content: mark,
        difficulty: values.difficulty,
        topic: values.topic,
        inStream: values.instream,
        outStream: values.outstream,
        timeConstraint: values.timeConstraint,
        spaceConstraint: values.spaceConstraint,
      },
      refetchQueries: [
        {
          query: GET_PROBLEM_STATEMENTS,
        },
      ],
    }).then((_) => {
      setMode('/list');
    });
  };

  const [deleteProblemStatement, { deleteProblemtokenData }] = useMutation(
    DELETE_PROBLEM_STATEMENT,
    {
      update(proxy, result) {
        // console.log('Log: Created a new problem successfully', result)
      },
      onError(err) {
        console.log('Log: Error creating a new problem', err);
      },
    },
  );

  const deleteProblem = (problem) => {
    deleteProblemStatement({
      variables: {
        id: problem.id,
      },
      refetchQueries: [
        {
          query: GET_PROBLEM_STATEMENTS,
        },
      ],
    }).then((_) => {
      window.alert('Problem Deleted!');
    });
  };

  const modeChange = () => {
    if (mode === '/list') {
      setMode('/modify');
    } else {
      setMode('/list');
      setEditProblem(null);
    }
  };

  useEffect(() => {
    if (editProblem != null) {
      setMode('/modify');
    }
  }, [editProblem]);

  // console.log(data)

  return (
    <div style={{ height: '100%', width: '100vw' }}>
      {mode === '/list' && (
        <div style={{ paddingTop: '2vh', paddingLeft: '5vw', paddingRight: '5vw' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <a
              class="button"
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={() => modeChange()}
            >
              Create More <i class="ti-arrow-right"></i>
            </a>
          </div>
          {data ? (
            <ProblemsList
              problems={data.problemStatements}
              deleteProblem={deleteProblem}
              setEditProblem={setEditProblem}
            />
          ) : (
            <> </>
          )}
        </div>
      )}
      {mode === '/modify' && (
        <div style={{ paddingTop: '2vh', paddingLeft: '5vw', paddingRight: '5vw' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <a
              class="button"
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={() => modeChange()}
            >
              Back <i class="ti-arrow-left"></i>
            </a>
          </div>
          <AddEditProblem
            problem={editProblem}
            createProblem={createProblem}
            updateProblem={updateProblem}
          />
        </div>
      )}
    </div>
  );
}
