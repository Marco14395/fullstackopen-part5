import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import ErrorMessage from './components/ErrorMessage'
import "./App.css"
import { set } from 'mongoose'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBlogs = async() => {
      const data = await blogService.getAll();
      setBlogs(data);
    }
    fetchBlogs();    
  }, [])

  useEffect(() => {
    const userInformationJSON = window.localStorage.getItem("userInfo")
    if(userInformationJSON)
    {
      const user = JSON.parse(userInformationJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleUsername = (e) => {
    setUsername(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try{
      const user = await blogService.login({username, password})
      window.localStorage.setItem("userInfo", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error){
      setErrorMessage("Wrong Username or Password 👏🏿")
      setTimeout(() => {
        setErrorMessage(null)
      }, 1800)
      setUsername("");
      setPassword("");
    }
  }

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  }

  const handleCreation = async(e) => {
    e.preventDefault();
    const data = blogService.createBlog({title, author, url: `https://${url}`});
    const newBlogList = blogs.concat(data);
    const results = await Promise.all(newBlogList);
    setBlogs(results);
    setErrorMessage(`A new blog ${title} by ${author} has been added`)
    setTimeout(() => {
      setErrorMessage(null);
    }, 2000)
    setTitle("");
    setAuthor("");
    setUrl("");
  }

  const loginForm = () => {
    return (
      <form className='loginForm' onSubmit={handleLogin}>
        <h1>Sign In</h1>
        <div className="inputContainer">
          <input type="text" id="username" value={username} onChange={handleUsername} placeholder="Username"/>
          <input type="password" id="password" value={password} onChange={handlePassword} placeholder="Password"/>
        </div>
        <ErrorMessage message={errorMessage} style={errorMessage === null? {display: "none"}: {backgroundColor: "rgba(255, 0, 0, .7)"}}/>
        <button type="submit" className="loginBtn">Login</button>
        <label htmlFor="signup" style={{fontSize: ".6rem", opacity: ".7", marginTop: "1rem", textDecoration: "none"}}><a href='#'>Signup if you don't have an existing account</a></label>
      </form>
    )
  }

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
        <ErrorMessage message={errorMessage} style={errorMessage === null? {display: "none"}: {backgroundColor: "rgba(136, 255, 136, .7)", color: "black", fontWeight: "800", marginBottom: "1rem"}}/>
        <div className="create">
          <h3 style={{marginBottom: "1rem"}}>Create new</h3>
            <input type="text" placeholder='Title:' value={title} onChange={e => setTitle(e.target.value)}/>
            <input type="text" placeholder='Author:' value={author} onChange={e => setAuthor(e.target.value)}/>
            <input type="text" placeholder='Url:' value={url} onChange={e => setUrl(e.target.value)}/>
            <button type='submit' className='createBtn' onClick={handleCreation}>Create</button>
        </div>
        </div>       
        <div className='blogs'>
          {blogs.map(blog =>
            <Blog blog={blog} key={blog.id}
             onClick={() => {
              blogService.deleteBlog(blog.id);
              setBlogs(blogs.filter(el => el.id !== blog.id))
            }}/>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {user === null && loginForm()}
      {user !== null && blogInterface()}
    </>
  )
}

export default App
