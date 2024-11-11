import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

  // If the user is logged in and set in local storage,
  // save user in session with new token
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Show blogs
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        blogs.sort((a, b) => b.likes - a.likes);
        setBlogs(blogs);
        console.log("Fetched blogs:", blogs);
      } catch (error) {
        console.log("Error fetching blogs:", error);
      }
    };
    getBlogs();
  }, []);

  // Add a blog
  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setNotification({
        message: `New blog: ${blogObject.title} by ${blogObject.author} added`,
        type: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 4500);
    } catch (exception) {
      setNotification({ message: "failed to create new blog", type: "error" });
      console.log(exception);
      setTimeout(() => {
        setNotification(null);
      }, 4500);
    }
  };

  // Updating the like count
  const updateTheLikeCount = async (updateBlog) => {
    const updatedBlog = await blogService.addLike(updateBlog);
    setBlogs((blogs) => {
      const updatedBlogs = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updateBlog : blog,
      );
      return updatedBlogs.sort((a, b) => b.likes - a.likes);
    });
  };

  // Delete own blog entry
  console.log("userinfo:", user);

  const deleteBlog = async (blogToGo) => {
    window.confirm(`delete this blog ${blogToGo.title}?`);
    await blogService.deleteBlog(blogToGo);
    setBlogs((blogs) => {
      return blogs.filter((blog) => blog.id !== blogToGo.id);
    });
  };

  // Display user form if user selects to login
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("HandlingLogin with...", username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });
      if (!user) {
        console.log("no user :( ):", user);
      }
      console.log("userinfo:", user);

      window.localStorage.setItem("loggedInBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotification({ message: "Incorrect credentials", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 4500);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    setNotification({ message: `${user.name} logged out.`, type: "error" });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
    window.localStorage.clear();
    setUser(null);
  };

  const blogFormRef = useRef();
  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification
          message={notification?.message}
          type={notification?.type}
        />
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification?.message} type={notification?.type} />
      <p>
        <span>{user.name} logged in</span>
        <button data-testid="logout-button" onClick={handleLogout}>
          logout
        </button>
      </p>
      <div>{blogForm()}</div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateTheLikeCount={updateTheLikeCount}
          deleteBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  );
};

export default App;
