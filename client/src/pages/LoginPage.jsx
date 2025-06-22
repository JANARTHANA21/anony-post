import React, { useState } from 'react'
import InputField from '../components/InputField'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
const Login = () => {
  const navigate=useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error,setError]=useState(false)

  const API_URL = import.meta.env.VITE_API_URL;
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(false)

    try {
      const res= await axios.post(`${API_URL}/api/auth/login`,{email,password},{withCredentials: true});

      if (res.status===200){
       navigate('/posts')
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (<>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto  p-4">
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
      <button  className="w-full bg-indigo-600 text-white py-3 rounded mt-4">Login</button>
      <br />

   
    </form>
      <Link to={'register'}>
      <button >not have an account ?</button>
      </Link>
    <div>
    {
      error?( <h1>{error}</h1>):(null)
    }
    </div>
    </>
  )
}
export default Login;