import React from 'react';
import AdminTutorialCard from './AdminTutorialCard';
const TutorialList = ({ tutorials, setEditTutorial, delete_tutorial }) => {
  const tutorialsList = [];

  return (
    <div class="col-lg-12" style={{ paddingLeft: '10vw', paddingRight: '10vw' }}>
      {' '}
      {tutorials.map((tutorial) => {
        return (
          <div class="column" style={{ paddingTop: '2.5vh' }}>
            <div>
              <AdminTutorialCard
                tutorial={tutorial}
                setEditTutorial={setEditTutorial}
                delete_tutorial={delete_tutorial}
              />
              <br />
            </div>
          </div>
        );
      })}{' '}
    </div>
  );
};

export default TutorialList;
