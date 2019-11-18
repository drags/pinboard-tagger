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
      isLoaded: false,
    }
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

  nextPost(props) {
  }

  prevPost(props) {
  }

  render() {
    if (this.state.isLoaded) {
      return(
        <div id="tagger">
          <Post
            post={this.state.posts[0]}
          />
          <Controls  />
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
