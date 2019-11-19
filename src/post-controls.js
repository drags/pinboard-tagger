import React from 'react';

function Controls(props) {
  return(
    <div className="post-controls">
      <button onClick={props.prevPost}>Prev</button>
      Some stuff ought to go here
      <button onClick={props.nextPost}>Next</button>
    </div>
  )
}

export default Controls;
