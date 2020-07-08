import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Header, Modal, Button, Icon } from 'semantic-ui-react';

export const GET_SUBMISSIONS = gql`
  query submissions($probId: String!) {
    submissions(probId: $probId) {
      code
      token
      timeTakenMillis
      spaceTakenBytes
      kind
      language
      createdDate
      updatedDate
    }
  }
`;

const UserSubmissions = ({ problem }) => {
  const { data, loading } = useQuery(GET_SUBMISSIONS, {
    variables: {
      probId: problem.id,
    },
  });
  // console.log('Log: User Submissions: ', data);

  const [modalOpen, setModalOpen] = useState();
  const [submissionCode, setSubmissionCode] = useState();

  const handleClose = () => {
    setModalOpen(false);
    setSubmissionCode(null);
  };

  return (
    <div>
      <Modal
        // trigger={<Button onClick={this.handleOpen}>Show Modal</Button>}
        open={modalOpen}
        onClose={handleClose}
        basic
        size="small"
      >
        <Header icon="browser" content="Submitted Code" />
        <Modal.Content co>
          <h3 style={{ color: 'white' }}>{submissionCode}</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={handleClose} inverted>
            <Icon name="checkmark" /> Okay
          </Button>
        </Modal.Actions>
      </Modal>
      <table
        class="ui table"
        style={{
          marginBottom: '20px',
          borderRadius: '0px',
          boxShadow: '0 6px 20px -5px rgba(0,0,0,0.01)',
        }}
      >
        <thead class="">
          <tr class="">
            <th class="" style={{ backgroundColor: 'white' }}>
              RESULT
            </th>
            <th class="" style={{ backgroundColor: 'white' }}>
              TIME TAKEN
            </th>
            <th class="" style={{ backgroundColor: 'white' }}>
              SPACE TAKEN
            </th>
            <th class="" style={{ backgroundColor: 'white' }}>
              LANGUAGE
            </th>
            <th class="" style={{ backgroundColor: 'white' }}>
              Submission DateTime
            </th>
          </tr>
        </thead>
        <tbody class="">
          {data &&
            data.submissions &&
            data.submissions.map((submission) => (
              <tr
                class=""
                onClick={() => {
                  setModalOpen(true);
                  setSubmissionCode(submission.code);
                }}
              >
                {submission.kind == '3' ? (
                  <td class="" style={{ color: 'green', fontWeight: '400' }}>
                    Success!
                  </td>
                ) : submission.kind == '4' ? (
                  <td class="" style={{ color: 'orange', fontWeight: '400' }}>
                    Wrong Answer!
                  </td>
                ) : (
                  <td class="" style={{ color: 'red', fontWeight: '400' }}>
                    Error!
                  </td>
                )}
                <td class="" style={{ fontWeight: '400' }}>
                  {submission.timeTakenMillis}
                </td>
                <td class="" style={{ fontWeight: '400' }}>
                  {submission.spaceTakenBytes}
                </td>
                <td class="" style={{ fontWeight: '400' }}>
                  C++
                </td>
                <td class="" style={{ fontWeight: '400' }}>
                  <Moment format="YYYY-MM-DD HH:mm">{submission.createdDate}</Moment>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserSubmissions;
