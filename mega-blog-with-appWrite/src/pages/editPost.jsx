import React,{useState , useEffect} from 'react'
import { Container , PostForm } from '../components/index'
import service from '../appwrite/config'
import { useParams , useNavigate } from 'react-router-dom'

function editPost() {
    const {slug} = useParams();
    const navigate = useNavigate();
    const [posts , setPosts] = useState(null);
    useEffect(()=>{
        if(slug){
            service.getpost(slug).then((post)=>{
                if(post){
                    setPosts(post);
                }
            })
        }else{
            navigate("/");
        }
    },[slug , navigate])
  return posts ? (
    <div className='w-full  py-8'>
        <Container> 
            <PostForm post={posts} />
        </Container>
    </div>
  ) : null
}

export default editPost
