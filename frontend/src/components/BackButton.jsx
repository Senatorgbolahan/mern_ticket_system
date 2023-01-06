import React from 'react'
import { FaArrowAltCircleLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'


const BackButton = ({ url }) => {

  return (
    <Link to={url} className= 'btn btn-reverser btn-back'>
        <FaArrowAltCircleLeft /> Back
    </Link>
  )
}

export default BackButton