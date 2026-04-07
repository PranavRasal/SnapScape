import React from 'react'
import service from '../appwrite/config'
import {Link} from 'react-router-dom'

function Postcard({$id , title,  featureImage }) {
  return (
   
      <Link to={`/post/${$id}`}>
      <div className='w-full bg-gray-100 rounded-xl p-4 '>
        <div className='justify-center w-full mb-4'>
        <img src={service.getfilepreview(featureImage)} alt={title} className='w-full h-64 object-cover rounded-xl mt-4' />
        </div>
        <h2 className='text-xl font-bold mb-2'>{title}</h2>
      </div>
      </Link>
     
   
  )
}

export default Postcard
