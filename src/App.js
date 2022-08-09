import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import ErrorMessage from "./components/ErrorMessage";
import "./App.css";
import CreateBlogInterface from "./components/CreateBlogInterface";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  const createBlogRef = useRef();
  const openBlogRef = useRef();

  useEffect(() => {
    const fetchBlogs = async() => {
      const data = await blogService.getAll();
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const userInformationJSON = window.localStorage.getItem("userInfo");
    if(userInformationJSON)
    {
      const user = JSON.parse(userInformationJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try{
      const user = await blogService.login({ username, password });
      window.localStorage.setItem("userInfo", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error){
      setErrorMessage("Wrong Username or Password ✋🏿");
      setTimeout(() => {
        setErrorMessage(null);
      }, 1800);
      setUsername("");
      setPassword("");
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const handleOpenCreateModal = () => {
    createBlogRef.current.toggleVisibility();
  };

  const handleCreation = async(e) => {
    e.preventDefault();
    const data = blogService.createBlog({ title, author, url: `https://${url}` });
    const newBlogList = blogs.concat(data);
    const results = await Promise.all(newBlogList);
    setBlogs(results);
    setErrorMessage(`A new blog ${title} by ${author} has been added`);
    setTimeout(() => {
      setErrorMessage(null);
    }, 2000);
    setTitle("");
    setAuthor("");
    setUrl("");
    handleOpenCreateModal();
  };


  const loginForm = () => {
    return (
      <form className='loginForm' onSubmit={handleLogin}>
        <h1>Sign In</h1>
        <div className="inputContainer">
          <input type="text" id="username" value={username} onChange={handleUsername} placeholder="Username"/>
          <input type="password" id="password" value={password} onChange={handlePassword} placeholder="Password"/>
        </div>
        <ErrorMessage message={errorMessage} style={errorMessage === null? { display: "none" }: { backgroundColor: "rgba(255, 0, 0, .7)" }}/>
        <button type="submit" className="loginBtn">Login</button>
      </form>
    );
  };

  const blogInterface = () => {
    return (
      <div className='container'>
        <div className='interface'>
          <div className="auth">
            <div className="titleContainer">
              <h5><span>{user.username}</span> is currently logged in</h5>
            </div>
            <button onClick={handleLogout} className="signOutBtn">Log out</button>
          </div>
          <ErrorMessage message={errorMessage} style={errorMessage === null? { display: "none" }: { backgroundColor: "rgba(136, 255, 136, .7)", color: "black", fontWeight: "800", marginBottom: "1rem" }}/>
          <CreateBlogInterface
            ref={createBlogRef}
            titleValue={title}
            authorValue={author}
            urlValue={url}
            titleOnChange={e => setTitle(e.target.value)}
            authorOnChange={e => setAuthor(e.target.value)}
            urlOnChange={e => setUrl(e.target.value)}
            onClick1={handleCreation}
          />
        </div>
        <div className='blogs'>
          {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog
              blog={blog}
              key={blog.id}
              ref={openBlogRef}
              addLikePerClick={async(e) => {
                e.preventDefault();
                const updatedBlog = { ...blog, likes: blog.likes + 1 };
                blogService.likeFunction(blog.id, updatedBlog);
                setBlogs(blogs.map(el => el.id === blog.id? updatedBlog: el));
              }}
              onClick={() => {
                if(window.confirm(`Are you sure you want to delete ${blog.title} by ${blog.author}`))
                {
                  blogService.deleteBlog(blog.id);
                  setBlogs(blogs.filter(el => el.id !== blog.id));
                }
              }}/>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {user === null && loginForm()}
      {user !== null && blogInterface()}
    </>
  );
};

export default App;
