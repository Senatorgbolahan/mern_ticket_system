import React, {useState, useEffect} from 'react'
import {FaSignInAlt} from 'react-icons/fa'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { login,reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Login() {

  const [formData, setFormData] = useState({ 
      email: "", 
      password: "", 
    })

    const { email, password} = formData;

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const {user, isLoading, message, isError, isSuccess} = useSelector((state) => state.auth)

    useEffect(() => {
      if (isError) {
        toast.error(message)
      }

      // Redirect when logged in
      if (isSuccess || user) {
          navigate('/')
      }

      dispatch(reset())

  }, [user, isLoading, isError, message, isSuccess, dispatch, navigate])

    const onChanged = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }))
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (!email || !password ) {
          toast.error('All field must not be empty!')
          return;
        }

        const userData = {email, password}
        dispatch(login(userData))        
    }

    if (isLoading) {
      <Spinner/>
    }


  return (
    <>
      <section className="heading">
          <h1> <FaSignInAlt/> Sign In</h1>
          <p>Please log in to get support</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
              <input 
                type="email" 
                className='form-control' 
                id='email'
                name='email'
                value={email}
                onChange={onChanged}
                placeholder="Enter your email"
                />
          </div>
          <div className="form-group">
              <input 
                type="password" 
                className='form-control' 
                id='password'
                name='password'
                value={password}
                onChange={onChanged}
                placeholder="Enter your password"
                />
          </div>
          <div className="form-group"><button className='btn btn-block'>Login</button></div>
        </form>
      </section>

    </>
  )
}

export default Login