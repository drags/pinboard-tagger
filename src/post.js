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
  tagReturn.push(<TagSuggest key="tagSuggest" allTags={props.allTags}/>)
  return tagReturn
}

function Post(props) {
  return(
    <div className="post">
      <div className="post-title"><h3>{props.post.Description}</h3></div>
      <div className="post-url"><a href={props.post.Url} target="_blank" rel="noopener noreferrer">{props.post.Url}</a></div>
      <div className="post-description">{props.post.Extended}</div>
      <div className="post-tags">Tags: {renderTags(props)}</div>
    </div>
  );
}

export default Post;
