import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedOnUserJSON = window.localStorage.getItem('loggedOnUser')

    if (loggedOnUserJSON) {
      const user = JSON.parse(loggedOnUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    // send username and password to backend for login
    try {
      const user = await loginService.login({ username, password })

      // set token format as how would like to send  to backend
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

      // save user to local storage
      window.localStorage.setItem('loggedOnUser', JSON.stringify(user))
    } catch (exception) {
      const errorMessage = exception.response.data.error
      setMessage(errorMessage)
      setMessageType('failure')
      setTimeout(() => {
        setMessage(null)
        setMessageType('')
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedOnUser')
  }

  const createBlog = async (newBlogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const createdBlog = await blogService.create(newBlogObject)
      setBlogs(blogs.concat(createdBlog))

      // generate success message for 5s
      setMessage(`A new Blog: ${createdBlog.title} by ${createdBlog.author} has been added!`)
      setMessageType('success')
      setTimeout(() => {
        setMessage(null)
        setMessageType('')
      }, 5000)

    } catch(exception) {
      const errorMessage = exception.response.data.error
      setMessage(errorMessage)
      setMessageType('failure')
      setTimeout(() => {
        setMessage(null)
        setMessageType('')
      }, 5000)
      if (errorMessage === 'token expired, user must log in again') {
        handleLogout()
      }
    }
  }

  const updateBlog = async (newBlogObject) => {
    try {
      const updatedBlog = await blogService.update(newBlogObject)

      // Replace blog
      const newBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
      setBlogs(newBlogs)

    } catch(exception) {
      const errorMessage = exception.response.data.error
      setMessage(errorMessage)
      setMessageType('failure')
      setTimeout(() => {
        setMessage(null)
        setMessageType('')
      }, 5000)
      if (errorMessage === 'token expired, user must log in again') {
        handleLogout()
      }
    }
  }

  const deleteBlog = async (blogToDelete) => {
    if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
      try {
        await blogService.deleteBlog(blogToDelete)

        // update blogs state
        const newBlogs = blogs.filter(blog => blog.id !== blogToDelete.id)
        setBlogs(newBlogs)

        // generate success message for 5s
        setMessage(`${blogToDelete.title} by ${blogToDelete.author} has been deleted!`)
        setMessageType('success')
        setTimeout(() => {
          setMessage(null)
          setMessageType('')
        }, 5000)
      } catch(exception) {
        console.log(exception)
        const errorMessage = exception.response.data.error
        setMessage(errorMessage)
        setMessageType('failure')
        setTimeout(() => {
          setMessage(null)
          setMessageType('')
        }, 5000)
        if (errorMessage === 'token expired, user must log in again') {
          handleLogout()
        }
      }
    }
  }

  if (user === null) {
    return (
      <>
        <h2>Log In to Application</h2>
        <Notification message={message} messageType={messageType} />
        <Togglable buttonLabel='Log In'>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </Togglable>
      </>
    )
  }

  return (
    <>
      <h2>Blogs</h2>
      <Notification message={message} messageType={messageType} />
      <p>{user.name} is Logged In</p>
      <button onClick={handleLogout}>Log Out</button>
      <h2>Create New</h2>
      <Togglable buttonLabel='Create' ref={blogFormRef}>
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <h2>Blog List</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
      )}
    </>
  )
}

export default App