import React from 'react';

function Controls(props) {
  return(
    <div className="post-controls">
      <button onClick={props.prevPost}>Newer</button>
      <button onClick={props.nextPost}>Older</button>
    </div>
  )
}

export default Controls;
