import React from 'react';
import Post from './post.js';
import Controls from './post-controls.js';
import { GlobalHotKeys } from "react-hotkeys";

class Tagger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taggerToast: "",
      untaggedOnly: false,
      posts: [],
      postDates: [],
      allTags: [],
      currentPost: 0,
      currentDate: 0,
      isLoaded: false,
      renderPost: true,
    }

    this.axios = this.props.axios
    this.addTag = this.addTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.nextPost = this.nextPost.bind(this)
    this.prevPost = this.prevPost.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleUntaggedCheckbox = this.handleUntaggedCheckbox.bind(this)
    this.postUpdated = this.postUpdated.bind(this)
    this.openLink = this.openLink.bind(this)
  }

  async componentDidMount() {
    const postDates = await this.getPostDates()
    const posts = await this.getPosts(postDates.data[0].Date)
    this.setState({
      postDates: postDates.data,
      posts: posts.data,
      isLoaded: true,
    })
    this.getTags()
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
    .then((res) => {
      res.data.sort((a,b) => {
        const dateA = Date.parse(a.Date)
        const dateB = Date.parse(b.Date)
        return dateB - dateA
      })
      return res
    })
    .catch((error) => {
      this.setState({
        taggerToast: "Error fetching posts: " + error.message,
      });
    });
  }

  getTags() {
    this.axios.get('/tags/get')
    .then((res) => {
      const tags = res.data
      const allTags = tags.map(x => x.Tag)
      console.log("Got a list of tags", allTags)
      this.setState({
        allTags: allTags,
      })
    })
    .catch((error) => {
      this.setState({
        taggerToast: "Error fetching tags: " + error.message,
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
        const post = this.state.posts[this.state.currentPost]
        if (Array.isArray(post.Tags)) {
          post.Tags.push(tag)
        } else {
          post.Tags = [tag]
        }
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

  postHasTags() {
    let post = this.state.posts[this.state.currentPost]
    if (post.Tags !== null && post.Tags.length > 0) {
      return true
    }
    return false
  }

  async nextPost() {
    if (this.state.currentPost < (this.state.posts.length - 1)) {
      this.setState({
        currentPost: this.state.currentPost + 1,
        renderPost: !this.state.untaggedOnly,
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
        renderPost: !this.state.untaggedOnly,
      })
    }
    if (!this.state.untaggedOnly || !this.postHasTags()) {
      this.setState({
        renderPost: true,
      })
    } else {
      this.nextPost()
    }
  }

  async prevPost() {
    if (this.state.currentPost > 0) {
      this.setState({
        currentPost: this.state.currentPost - 1,
        renderPost: !this.state.untaggedOnly,
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
        renderPost: !this.state.untaggedOnly,
      })
    }
    if (!this.state.untaggedOnly || !this.postHasTags()) {
      this.setState({
        renderPost: true,
      })
    } else {
      this.prevPost()
    }
  }

  renderDateOptions() {
    const postDates = this.state.postDates
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

  handleUntaggedCheckbox(event) {
    this.setState({
      untaggedOnly: event.target.checked,
    })
  }

  postUpdated() {
    this.setState({
      taggerToast: ""
    })
  }

  openLink() {
    const post = this.state.posts[this.state.currentPost]
    const link = post.Url
    window.open(link, "_blank")
  }

  render() {
    const keyMap = {
      LEFTARROW: "ArrowLeft",
      RIGHTARROW: "ArrowRight",
      GEE: "g",
    };

    const handlers = {
      LEFTARROW: this.prevPost,
      RIGHTARROW: this.nextPost,
      GEE: this.openLink,
    }

    if (!this.state.isLoaded) {
      return(
        <div id="tagger">
          Loading...
        </div>
      )
    }
    return(
      <div className="tagger">
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
        <div className="tagger-header">
          <span>
            <label>Posts from:</label>
            <select name="dateSelect" value={this.state.currentDate} onChange={this.handleDateChange}>
              {this.renderDateOptions()}
            </select>
          </span>
          <span>
            <label>Show only untagged posts:</label>
            <input type="checkbox" checked={this.state.onlyUntaggedPosts} onChange={this.handleUntaggedCheckbox} />
          </span>
        </div>
        <Post
          post={this.state.posts[this.state.currentPost]}
          deleteTag={this.deleteTag}
          addTag={this.addTag}
          allTags={this.state.allTags}
          postUpdated={this.postUpdated}
          renderPost={this.state.renderPost}
        />
      <div>
        <span className="tagger-toast">{this.state.taggerToast}</span>
      </div>
        <Controls
          nextPost={this.nextPost}
          prevPost={this.prevPost}
        />
        <div className="hotkeys-help">
          <h3>Hotkeys:</h3>
          <ul>
            <li>&larr; : Previous Post</li>
            <li>&rarr; : Next Post</li>
            <li>t : Focus new tag input</li>
            <li>g : Open link in new tab</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Tagger;
