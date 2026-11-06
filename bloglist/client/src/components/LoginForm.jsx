import { TextField, Button, Box } from '@mui/material'
const LoginForm = ({
  username,
  password,
  handleUserChange,
  handlePassChange,
  handleLogin
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <Box component="form" onSubmit={handleLogin} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        <TextField label="username" value={username} onChange={handleUserChange}/>
        <TextField label="password" value={password} onChange={handlePassChange}/>
        <Button type="submit" variant="contained" style={{marginTop: 10}}>login</Button>
      </Box>
    </div>
  )
}

export default LoginForm