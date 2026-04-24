import React , {useEffect , useState} from 'react'
import{container , PostForm } from '../components/index'
import service from '../appwrite/config'
function Home() {
  const [posts , setPosts] = useState([]);

  useEffect(()=>{
   service.getposts().then((posts)=>{
    if(posts){
      setPosts(posts.documents);
    }
   })
  },[])
 if(posts.length === 0){
  return (
    <div className='min-h-screen flex flex-col'>
    <container>
      <div className='py-5 flex-1 flex items-center justify-center'>
      <h2 className='text-center'>No posts yet</h2>
       </div>
    </container>
     </div>
  )
 }
 return(
  <div className='min-h-screen flex flex-col'>
    <container>
      <div className='py-5 flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {
          posts.map((post)=>{
            <div key={post.$id} className="w-1/4 p-2">
            <PostForm {...post}/>
            </div>
          })
        }
       </div>
    </container>
     </div>
 )


}

export default Home
