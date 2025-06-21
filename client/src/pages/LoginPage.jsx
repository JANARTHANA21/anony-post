import React, { useState } from 'react'
import InputField from '../components/InputField'
import { Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userauth,setuserauth]=useState(true)
  

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-md mx-auto  p-4">
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        required
      />
      <InputField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        required
        showToggle
        toggleHandler={() => setShowPassword(!showPassword)}
      />
      <Link to={userauth?"posts":null}>
      <button  className="w-full bg-indigo-600 text-white py-3 rounded mt-4">Login</button>
      </Link>
      <br />
      <Link to={'register'}>
      <button >not have an account ?</button>
      </Link>
    </form>
  )
}
export default Login;