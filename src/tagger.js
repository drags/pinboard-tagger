import React from 'react';
import Post from './post.js';
import Controls from './post-controls.js';


class Tagger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taggerToast: "",
      filterTags: [],
      posts: [],
      currentPost: 0,
      isLoaded: false,
    }

    this.nextPost = this.nextPost.bind(this)
    this.prevPost = this.prevPost.bind(this)
  }

  componentDidMount() {
    this.getPosts()
  }

  getPosts() {
    const axios = this.props.axios
    axios.get('/posts/get?date=2019-10-25')
    .then((res) => {
      console.log(res.data)
      const newPosts = this.state.posts.concat(res.data);
      this.setState({
        posts: newPosts,
        isLoaded: true,
      })
    })
    .catch((error) => {
      this.setState({
        taggerToast: "Error from server: " + error.message + ". Try again later.",
      });
    });
  }

  updatePost(props) {
  }

  nextPost() {
    if (this.state.currentPost < (this.state.posts.length - 1)) {
      this.setState({
        currentPost: this.state.currentPost + 1,
      })
    }
  }

  prevPost() {
    if (this.state.currentPost > 0) {
      this.setState({
        currentPost: this.state.currentPost - 1,
      })
    }
  }

  render() {
    if (this.state.isLoaded) {
      return(
        <div id="tagger">
          <Post
            post={this.state.posts[this.state.currentPost]}
          />
        <br />
        <br />
          <Controls
            nextPost={this.nextPost}
            prevPost={this.prevPost}
          />
        </div>
      )
    } else {
      return(
        <div id="tagger">
          Loading...
        </div>
      )
    }
  }
}

export default Tagger;
