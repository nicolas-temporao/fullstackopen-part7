import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    await createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h2>Create New Blog</h2>

      <Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        <TextField
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <TextField
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <TextField
          label="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />

        <Button type="submit" variant="contained" style={{marginTop: 10}}>save</Button>
      </Box>
    </div>
  )
}

export default BlogForm