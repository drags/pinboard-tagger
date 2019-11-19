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

    this.addTag = this.addTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
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

  deleteTag(tag) {
    const post = this.state.posts[this.state.currentPost]
    const axios = this.props.axios
    const params = new URLSearchParams()
    params.append("url", post.Url)
    params.append("tag", tag)
    axios.post('/posts/deleteTag', params)
      .then((res) => {
        console.log("Deleted tag " + tag + " from URL:" + post.Url)

        const posts = this.state.posts

        // Delete tag from local state
        post.Tags = post.Tags.filter((t) => {return t !== tag})
        posts[this.state.currentPost] = post
        this.setState({
          posts: posts,
          taggerToast: "Deleted tag: " + tag,
        })
      })
      .catch((error) => {
        console.log("Error deleting tag " + tag + " from URL:" + post.Url + ". Error:" + error.message)
        this.setState({
          taggerToast: "Failed to delete tag: " + tag,
        })
      });
  }

  addTag(tag) {
    const post = this.state.posts[this.state.currentPost]
    const axios = this.props.axios
    const params = new URLSearchParams()
    params.append("url", post.Url)
    params.append("tag", tag)
    axios.post('/posts/addTag', params)
      .then((res) => {
        console.log("Added tag " + tag + " to URL:" + post.Url)
        this.setState({
          taggerToast: "Added tag: " + tag,
        })
      })
      .catch((error) => {
        console.log("Error adding tag " + tag + " to URL:" + post.Url + ". Error:" + error.message)
        this.setState({
          taggerToast: "Failed to add tag: " + tag,
        })
      });
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
            deleteTag={this.deleteTag}
            addTag={this.addTag}
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
