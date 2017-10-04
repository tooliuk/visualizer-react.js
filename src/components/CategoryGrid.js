import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

//Import components
import SingleGrid from './SingleGrid';

// Import media
import loadingGif from '../media/loadAnimated.gif';

class CategoryGrid extends React.Component {
  static propTypes = {
    category: PropTypes.string.isRequired
  }

  // Set up the default state with a property intitializer
  // instead of writing a whole constructor just for this
  // You can reference 'this.props' here if you need to.
  state = {
    posts: [],
    loading: true,
    error: null
  }

  componentDidMount() {
    // Remove the 'www.' to cause a CORS error (and see the error state) - http://www.reddit.com/r/${this.props.category}.json
    axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category%3A${this.props.category}&cmlimit=24&cmsort=sortkey&origin=*`)
      .then(res => {
        // Transform the raw data by extracting the nested posts
        const posts = res.data.query.categorymembers;

        // Update state to trigger a re-render.
        // Clear any errors, and turn off the loading indiciator.
        this.setState({
          posts,
          loading: false,
          error: null
        });
      })
    .catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          loading: false,
          error: err
        });
      });
  }

  renderLoading() {
    return <div><img className="loading" alt="loagind" src={loadingGif} /></div>;
  }

  renderError() {
    return (
      <div>
        Something went wrong: {this.state.error.message}
      </div>
    );
  }

  renderPosts() {
    // Using destructuring to extract the 'error' and 'posts'
    // keys from state. This saves having to write "this.state.X" everwhere.
    const { error, posts } = this.state;

    if(error) {
      return this.renderError();
    }

    return (
      <div className="categoryGrid">
        {posts.map(post =>
            <SingleGrid key={post.pageid} pageid={post.pageid} />
        )}
      </div>
    );
  }

  render() {
    const { category } = this.props;
    const { loading } = this.state;

    return (
      <div>
        <h1>{category}</h1>
        <hr/>
        {loading ? this.renderLoading() : this.renderPosts()}
      </div>
    );
  }
}


export default CategoryGrid;
