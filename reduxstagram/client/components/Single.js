import React from 'react';
import Photo from './Photo';
import Comments from './Comments';

const Single = React.createClass({
    render() {
        const { postId } = this.props.params;

        // Index of the post.
        const i = this.props.posts.findIndex((post) => post.code === postId );
    
        // The actual post.
        const post = this.props.posts[i];

        // The post comments.
        const comments = this.props.comments[postId] || [];

        return (
            <div className="single-photo">
                <Photo i={i} post={post} {...this.props} />
                <Comments postComments={comments} {...this.props} />
            </div>
        );
    }
});

export default Single;