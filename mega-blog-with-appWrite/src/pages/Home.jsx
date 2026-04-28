import React , {useEffect , useState} from 'react'
import{Container , Postcard } from '../components/index'
import service from '../appwrite/config'
import { useSelector } from 'react-redux'

function Home() {
  const [posts , setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(()=>{
   service.getposts().then((posts)=>{
    if(posts){
      console.log('✓ Posts loaded from DB:', posts.documents.map(p => ({id: p.$id, title: p.title, hasImage: !!p.image})));
      setPosts(posts.documents);
    }
   })
  },[authStatus])
 if(posts.length === 0){
  return (
    <div className='min-h-screen flex flex-col'>
    <Container>
      <div className='py-5 flex-1 flex items-center justify-center'>
      <h2 className='text-center text-(--text)'>No posts yet</h2>
       </div>
    </Container>
     </div>
  )
 }
 return(
  <div className='min-h-screen flex flex-col'>
    <Container>
      <div className='py-5 flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {
          posts.map((post)=>{
             return <Postcard key={post.$id} $id={post.$id} title={post.title} content={post.body || post.content} featuredImage={post.image} />
          })
        }
       </div>
    </Container>
     </div>
 )


}

export default Home
