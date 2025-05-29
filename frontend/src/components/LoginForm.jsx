import { useState } from 'react'

const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => {
  const [loginVisible, setLoginVisible] = useState(false)

  const hideWhenVisible = { display: loginVisible ? 'none' : '' }
  const showWhenVisible = { display: loginVisible ? '' : 'none' }

  const toggleVisibility = () => setLoginVisible(!loginVisible)

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          Username: <input type ='text' name='username' value={username} onChange={(event) => setUsername(event.target.value)}/>
        </div>
        <div>
          Password: <input type ='password' name='password' value={password} onChange={(event) => setPassword(event.target.value)}/>
        </div>
        <input type='submit' value='Log In'/>
      </form>
    </div>
  )
}

export default LoginForm