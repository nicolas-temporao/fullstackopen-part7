import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Button,
  Typography
} from '@mui/material'


const BlogDetails = ({ blog, handleLike, user, handleRemove }) => {
  if (!blog) {
    return null
  }

  const removePerm = blog.user?.username === user?.username

  return (
    <Card sx={{maxWidth: 600, marginTop:2}}>
      <CardContent>
        <Typography variant="h4">{blog.title}</Typography>
        <Typography>by {blog.author}</Typography>
        <Typography>{blog.url}</Typography>
        <Typography>likes: {blog.likes}</Typography>

        {user && (
          <Button
            variant="contained"
            onClick={() => handleLike(blog)}
            sx={{ marginTop: 1 }}
          >
            like
          </Button>
        )}

        <Typography>added by {blog.user?.name}</Typography>

        {removePerm && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleRemove(blog)}
            sx={{ marginTop: 2 }}
          >
            remove
          </Button>
          )}
      </CardContent>
    </Card>
  )
}

const BlogView = ({ blogs, handleLike, user, handleRemove }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return <h2>Blog not found.</h2>
  }
  const removeBlog = async () => {
    const removed = await handleRemove(blog)

    if (removed) {
      navigate('/')
    }
  }

  return (
    <BlogDetails
      blog={blog}
      handleLike={handleLike}
      user={user}
      handleRemove={removeBlog}
    />
  )
}

export { BlogDetails }
export default BlogView