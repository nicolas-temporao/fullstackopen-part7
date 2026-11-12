import { useState, useEffect, useContext } from 'react'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import Notification from './components/Notification'
import NotificationContext from './NotificationContext'
import UserContext from './UserContext'
import './index.css'

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { dispatch } = useContext(NotificationContext)
  const { user, setUser } = useContext(UserContext)
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })
  const blogs = result.data ?? []

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const likeBlogMutation = useMutation({
    mutationFn: ({id, updatedBlog}) => blogService.update(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

    const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })


  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showMessage = (text, type) => {
    dispatch({ type: 'SHOW', payload: { text, type } })

    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedInUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showMessage('Login Successful', 'success')
    } catch {
      showMessage('Wrong username or password', 'error')
    }
  }

  const handleNewBlog = async (newBlog) => {
    try {
      const createdBlog = await newBlogMutation.mutateAsync(newBlog)

      showMessage(`A new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success')
    } catch {
      showMessage('Failed to create blog', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedInUser')
  }

  const handleLike = async (blog) => {
    if (!user) {
      showMessage('Only logged in users can like.', 'error')
      return
    }

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    await likeBlogMutation.mutateAsync({id: blog.id, updatedBlog})
    
  }

  const handleRemove = async (blog) => {
    if (!window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      return false
    }

    try {
      await removeBlogMutation.mutateAsync(blog.id)

      showMessage('Deleted blog successfully', 'success')
      return true
    } catch {
      showMessage('Failed to delete blog', 'error')
      return false
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <Container>
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" component={Link} to="/" sx={style}>
                blogs
              </Button>
              {user === null ? (
                <Button color="inherit" component={Link} to="/login" sx={style}>
                  login
                </Button>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/create" sx={style}>
                    create new
                  </Button>
                  <Button color="inherit" onClick={handleLogout} sx={style}>
                    logout
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar>
          <ErrorBoundary>
            <Notification />
            {user !== null && <p>{user.name} logged in.</p>}

            <Routes>
              <Route
                path="/"
                element={
                  <BlogList
                    blogs={sortedBlogs}
                    handleLike={handleLike}
                    user={user}
                    handleRemove={handleRemove}
                    handleNewBlog={handleNewBlog}
                  />
                }
              />

              <Route
                path="/login"
                element={
                  user === null ? (
                    <LoginForm
                      username={username}
                      password={password}
                      handleUserChange={({ target }) => setUsername(target.value)}
                      handlePassChange={({ target }) => setPassword(target.value)}
                      handleLogin={handleLogin}
                    />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

              <Route
                path="/blogs/:id"
                element={
                  <BlogView
                    blogs={blogs}
                    handleLike={handleLike}
                    user={user}
                    handleRemove={handleRemove}
                  />
                }
              />

              <Route
                path="/create"
                element={user ? <BlogForm createBlog={handleNewBlog} /> : <Navigate to="/login" />}
              />

              <Route path="*" element={<h1>Error: Page Not Found</h1>} />
            </Routes>
          </ErrorBoundary>
        </div>
      </Router>
    </Container>
  )
}

export default App
