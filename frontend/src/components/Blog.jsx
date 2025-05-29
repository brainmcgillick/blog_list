import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleDetails = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    border: 'solid',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonStyle = {
    marginLeft: 10
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    updateBlog(updatedBlog)
  }

  const handleDelete = () => {
    deleteBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={buttonStyle} onClick={toggleDetails}>View</button>
        {user.username === blog.user.username &&
          <button style={buttonStyle} onClick={handleDelete}>Delete</button>
        }
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          Likes: {blog.likes}
          {user.username !== blog.user.username &&
            <button style={buttonStyle} onClick={handleLike}>Like</button>
          }
        </div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog