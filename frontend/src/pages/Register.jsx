import React, {useState, useEffect} from 'react'
import {FaUser} from 'react-icons/fa'
import {toast} from 'react-toastify'
import {useSelector, useDispatch} from 'react-redux'
import { register, reset } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Spinner  from '../components/Spinner'


function Register() {

  const [formData, setFormData] = useState({ 
      name: "", 
      email: "", 
      password: "", 
      password2: ""
    })

    const { name, email, password, password2} = formData;

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user, isLoading, isError, message, isSuccess} = useSelector((state) => state.auth)

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

        if (!name || !email || !password || !password2) {
          toast.error('All field must not be empty!')
        }

        if (password !== password2) {
          toast.error('Password do not match!')
        }
        else{
          const userData = {name, email,password}
          dispatch(register(userData))
        }
    }

    if (isLoading) {
      <Spinner/>
    }


  return (
    <>
      <section className="heading">
          <h1> <FaUser/> Register</h1>
          <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
              <input 
                type="text" 
                className='form-control' 
                id='name'
                name='name'
                value={name}
                onChange={onChanged}
                placeholder="Enter your name"
                />
          </div>
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
          <div className="form-group">
              <input 
                type="password" 
                className='form-control' 
                id='password2'
                name='password2'
                value={password2}
                onChange={onChanged}
                placeholder="Confirm your password"
                />
          </div>
          <div className="form-group"><button className='btn btn-block'>Submit</button></div>
        </form>
      </section>

    </>
  )
}

export default Register