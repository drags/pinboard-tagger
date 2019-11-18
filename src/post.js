import React from 'react';
import Tag from './tag.js';

function Post(props) {
  return(
    <div className="post">
      <h3>{props.post.Description}</h3>
      <p><a href={props.post.Url}>{props.post.Url}</a></p>
      <p className="post-description">{props.post.Extended}</p>
      <p>{props.post.Tags.map((t) => {
        return(
          <Tag key={t} tag={t} />
        );
      })
      }</p>
    </div>
  );
}

export default Post;
