import React from 'react';
import Tag from './tag.js';

function renderTags(props) {
  const tagReturn = []
  if (props.post.Tags !== null) {
    props.post.Tags.map((t) => {
      return tagReturn.push(<Tag key={t} tag={t} deleteTag={props.deleteTag}/>)
    })
  }
  // TODO: add new tag input
  return tagReturn
}

function Post(props) {
  return(
    <div className="post">
      <h3>{props.post.Description}</h3>
      <p><a href={props.post.Url}>{props.post.Url}</a></p>
      <p className="post-description">{props.post.Extended}</p>
      <p>Tags: {renderTags(props)}</p>
    </div>
  );
}

export default Post;
