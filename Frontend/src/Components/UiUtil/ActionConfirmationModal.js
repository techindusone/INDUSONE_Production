import React from 'react';

// Modal to Handle Confirmations
const ActionConfirmationModal = ({ triggerId, elementId, elementName, action, onConfirm }) => {
  return (
    <div id={triggerId} className="modal">
      <div className="modal-content">
        <h6>Alert !</h6>
        {/* Indicate the action and the assignee */}
        <p>
          Are you sure you want to {action} {elementName} ?
        </p>
        <button
          className="modal-close waves-effect waves-green btn "
          style={{ margin: '10px' }}
          onClick={() => {
            onConfirm(elementId);
          }}
        >
          Yes
        </button>
        <button className="modal-close waves-effect waves-red btn red " style={{ margin: '10px' }}>
          No
        </button>
      </div>
    </div>
  );
};

export default ActionConfirmationModal;
