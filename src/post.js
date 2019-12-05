import React from 'react';
import Tag from './tag.js';
import TagSuggest from './tag-suggest.js';

class Post extends React.Component {
  renderTags(props) {
    let tagReturn = []
    if (props.post.Tags !== null) {
      tagReturn = props.post.Tags.map((t) => {
        return(<Tag key={t} tag={t} deleteTag={props.deleteTag}/>)
      })
    }
    tagReturn.push(<TagSuggest key="tagSuggest" allTags={props.allTags} addTag={props.addTag}/>)
    return tagReturn
  }

  componentDidUpdate(prevProps) {
    if (this.props.post.Hash !== prevProps.post.Hash) {
      this.props.postUpdated()
    }
    if (this.props.renderPost !== prevProps.renderPost) {
      this.props.postUpdated()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.renderPost
  }

  render() {
    return(
      <div className="post">
        <div className="post-title"><h3>{this.props.post.Description}</h3></div>
        <div className="post-url"><a href={this.props.post.Url} target="_blank" rel="noopener noreferrer">{this.props.post.Url}</a></div>
        <div className="post-description">{this.props.post.Extended}</div>
        <div className="post-tags">Tags: {this.renderTags(this.props)}</div>
      </div>
    );
  }
}

export default Post;
