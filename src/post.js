import React from 'react';
import Tag from './tag.js';
import TagSuggest from './tag-suggest.js';

function renderTags(props) {
  let tagReturn = []
  if (props.post.Tags !== null) {
    tagReturn = props.post.Tags.map((t) => {
      return(<Tag key={t} tag={t} deleteTag={props.deleteTag}/>)
    })
  }
  tagReturn.push(<span><TagSuggest allTags={props.allTags}/></span>)
  return tagReturn
}

function Post(props) {
  return(
    <div className="post">
      <h3>{props.post.Description}</h3>
      <p><a href={props.post.Url} target="_blank" rel="noopener noreferrer">{props.post.Url}</a></p>
      <p className="post-description">{props.post.Extended}</p>
      <p>Tags: {renderTags(props)}</p>
    </div>
  );
}

export default Post;
