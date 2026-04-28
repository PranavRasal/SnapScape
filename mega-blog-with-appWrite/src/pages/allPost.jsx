import React , {useEffect , useState} from 'react'
import { Container , Postcard } from '../components/index'
import service from '../appwrite/config'
import { useSelector } from 'react-redux'
import { Query } from 'appwrite'

function allPost() {
  const [posts , setPosts] = useState([]) ;
  const userData = useSelector((state) => state.auth.userData);

  useEffect(()=>{
    if(!userData?.$id){
      setPosts([]);
      return;
    }

    service.getposts([Query.equal('userID', userData.$id)]).then((posts)=>{
     if(posts){
       console.log('✓ Own posts loaded:', posts.documents.map(p => ({id: p.$id, title: p.title, image: p.image, userID: p.userID})));
       setPosts(posts.documents);
     }
   })
  },[userData?.$id])

  if(!userData?.$id){
    return (
      <div className='min-h-screen flex flex-col'>
        <Container>
          <div className='py-5 flex-1 flex items-center justify-center'>
            <h2 className='text-center'>Login to view your posts</h2>
          </div>
        </Container>
      </div>
    )
  }

  if(posts.length === 0){
    return (
      <div className='min-h-screen flex flex-col'>
        <Container>
          <div className='py-5 flex-1 flex items-center justify-center'>
            <h2 className='text-center'>No posts yet</h2>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Container>
        <div className='py-5 flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {posts.map((post)=>(
            <Postcard
              key={post.$id}
              $id={post.$id}
              title={post.title}
              content={post.content}
              featuredImage={post.image}
            />
          ))}
        </div>
      </Container>
    </div>
  )
}

export default allPost
