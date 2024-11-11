import { useState } from "react";

const Blog = ({ blog, updateTheLikeCount, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 5,
    border: "solid",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
  };
  const buttonStyle = {
    margin: 5,
  };

  const [infoVisible, setInfoVisible] = useState(false);

  const hideWhenInfoVisible = { display: infoVisible ? "none" : "" };
  const showWhenInfoVisible = { display: infoVisible ? "" : "none" };

  const toggleVisibility = () => {
    setInfoVisible(!infoVisible);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    updateTheLikeCount(updatedBlog);
  };

  // See if the user is the blog poster (check incase the is no blog.user assigned to a post)
  const blogPoster = blog.user
    ? user.blogs.some((userBlog) => userBlog.user === blog.user.id)
    : false;

  return (
    <div>
      <div style={hideWhenInfoVisible}>
        <div className="blog-title-author" style={blogStyle}>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility} style={buttonStyle}>
            view
          </button>
        </div>
      </div>
      <div style={showWhenInfoVisible}>
        <div className="expandedBlogView" style={blogStyle}>
          <div className="blog-title">
            {blog.title}
            <button onClick={toggleVisibility} style={buttonStyle}>
              hide
            </button>
          </div>
          <div data-testid="blog-url">{blog.url}</div>
          <div data-testid="blog-likes">
            likes: {blog.likes}
            <button
              data-testid="like-button"
              onClick={handleLike}
              style={buttonStyle}
            >
              like
            </button>
          </div>
          <div className="blog-author">{blog.author}</div>
          {blogPoster && (
            <button style={buttonStyle} onClick={() => deleteBlog(blog)}>
              delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
