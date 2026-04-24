import React , {useEffect , useState} from 'react'
import { Container , Postcard } from '../components/index'
import service from '../appwrite/config'
function allPost() {
  const [posts , setPosts] = useState([]) ; 
  useEffect(()=>{},[])
   service.getposts([]).then((posts)=>{
     if(posts){
       setPosts(posts.documents);
     }
   })

  return (
    <div className='w-full  py-8'>
      <Container>
        <div className = "flex flex-wrap gap-4">
        {posts.map((post)=>(
          <div key={post.$id} className='w-full md:w-1/2 lg:w-1/3'>
          <Postcard post={post} />
          </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default allPost
