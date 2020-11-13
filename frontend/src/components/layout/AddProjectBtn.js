import React from 'react';

const AddProjectBtn = (props) => {
  return (
    <div className='fixed-action-btn'>
      <a
        href='#'
        className='btn-floating btn-large blue darken-2 modal-trigger'
        onClick={props.open}
      >
        <i className='large material-icons'>add</i>
      </a>
      {/* <a
        href='#'
        className='btn-floating btn-large blue darken-2 modal-trigger'
      >
        <i className='large material-icons'>add</i>
      </a> */}
      
    </div>
  );
};

export default AddProjectBtn;
