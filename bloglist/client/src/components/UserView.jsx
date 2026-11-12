import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import userService from '../services/users'

const UserView = () => {
  const { id } = useParams()
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })

  const user = users.find(user => user.id === id)

  if (!user) {
    return <h2>User not found.</h2>
  }

  return (
    <div>
        <Typography variant="h4">
            {user.name}
        </Typography>

        <Typography variant="h6">
            added blogs:
        </Typography>

        <ul>
            {user.blogs?.map(blog=>(
                <li key={blog.id}>
                    {blog.title}
                </li>
            ))}
        </ul>
    </div>
  )
}

export default UserView
