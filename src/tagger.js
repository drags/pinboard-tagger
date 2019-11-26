import React from 'react';
import Post from './post.js';
import Controls from './post-controls.js';


class Tagger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taggerToast: "",
      untaggedOnly: false,
      posts: [],
      postDates: [],
      tags: [],
      currentPost: 0,
      currentDate: 0,
      isLoaded: false,
    }

    this.axios = this.props.axios
    this.addTag = this.addTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.nextPost = this.nextPost.bind(this)
    this.prevPost = this.prevPost.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  async componentDidMount() {
    const postDates = await this.getPostDates()
    postDates.data.reverse()
    const posts = await this.getPosts(postDates.data[0].Date)
    this.setState({
      postDates: postDates.data,
      posts: posts.data,
      isLoaded: true,
    })
    //this.getTags()
  }

  getPostDates() {
    return this.axios.get('/posts/dates')
    .catch((error) => {
      this.setState({
        taggerToast: "Error fetching post dates: " + error.message,
      })
    })
  }

  getPosts(date) {
    console.log("Getting posts with date", date)
    return this.axios.get('/posts/get?date=' + date)
    .catch((error) => {
      this.setState({
        taggerToast: "Error fetching posts: " + error.message,
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

  async nextPost() {
    if (this.state.currentPost < (this.state.posts.length - 1)) {
      this.setState({
        currentPost: this.state.currentPost + 1,
      })
    } else {
      let nextDate = this.state.currentDate + 1
      if (nextDate >= this.state.postDates.length) {
        return
      }
      const posts = await this.getPosts(this.state.postDates[nextDate].Date)
      this.setState({
        posts: posts.data,
        currentDate: nextDate,
        currentPost: 0,
      })
    }
  }

  async prevPost() {
    if (this.state.currentPost > 0) {
      this.setState({
        currentPost: this.state.currentPost - 1,
      })
    } else {
      let prevDate = this.state.currentDate - 1
      if (prevDate < 0) {
        return
      }
      const posts = await this.getPosts(this.state.postDates[prevDate].Date)
      this.setState({
        posts: posts.data,
        currentDate: prevDate,
        currentPost: posts.data.length - 1,
      })
    }

  }

  renderDateOptions() {
    const postDates = this.state.postDates.reverse()
    const dateOptions = postDates.map((pd, i) => {
      return(<option key={i} value={i}>{pd.Date}</option>)
    })
    return dateOptions
  }

  async handleDateChange(event) {
    console.log("handling date change", event.target.value)
    const dateIndex = event.target.value
    const posts = await this.getPosts(this.state.postDates[dateIndex].Date)
    this.setState({
      posts: posts.data,
      currentDate: dateIndex,
      currentPost: 0,
    })
  }

  render() {
    if (!this.state.isLoaded) {
      return(
        <div id="tagger">
          Loading...
        </div>
      )
    }
    return(
      <div id="tagger">
        Posts from: <select name="dateSelect" value={this.state.currentDate} onChange={this.handleDateChange}>
          {this.renderDateOptions()}
        </select>
        <Post
          post={this.state.posts[this.state.currentPost]}
          deleteTag={this.deleteTag}
          addTag={this.addTag}
          allTags={this.state.allTags}
        />
      <br />
      <div>
        <span className="tagger-toast">{this.state.taggerToast}</span>
      </div>
      <br />
        <Controls
          nextPost={this.nextPost}
          prevPost={this.prevPost}
        />
      </div>
    )
  }
}

export default Tagger;
