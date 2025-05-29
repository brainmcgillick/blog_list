import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = async (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={handleNewBlog}>
        <div>
          Title: <input type='text' name='title' value={title} onChange={(event) => setTitle(event.target.value)}/>
        </div>
        <div>
          Author: <input type='text' name='author' value={author} onChange={(event) => setAuthor(event.target.value)}/>
        </div>
        <div>
          URL: <input type='text' name='url' value={url} onChange={(event) => setUrl(event.target.value)}/>
        </div>
        <input type='submit' value='Create'/>
      </form>
    </div>
  )
}

export default BlogForm