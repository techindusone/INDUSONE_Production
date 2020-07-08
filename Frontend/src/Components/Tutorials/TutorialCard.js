import React from 'react';

const TutorialCard = (tutorial) => {
  // console.log(tutorial.tutorial)

  return (
    <>
      {tutorial ? (
        <div
          class="ui fluid card"
          style={{ border: 'none', boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)' }}
        >
          <div class="content">
            <div class="header">{tutorial.tutorial.title}</div>
            <div class="description" style={{ fontWeight: 700 }}>
              15% Companies test this topic
            </div>
          </div>
          <div class="extra content">
            <a
              class="button"
              style={{
                color: 'white',
                cursor: 'pointer',
                borderRadius: '0',
                boxShadow: '0 8px 6px -6px #7971EA',
              }}
            >
              Start Learning <i aria-hidden="true" class="icon angle right white"></i>
            </a>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TutorialCard;
