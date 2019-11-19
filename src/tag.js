import React from 'react';

function Tag(props) {
  return(
    <span className="post-tag">{props.tag}  <button onClick={props.deleteTag.bind(this, props.tag)}>x</button></span>
  )
}

export default Tag;
