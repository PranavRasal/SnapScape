import React , {useEffect , useState} from 'react'
import { Container , Postcard } from '../components/index'
import service from '../appwrite/config'
import { useSelector } from 'react-redux'
import { Query } from 'appwrite'

function allPost() {
  const [posts , setPosts] = useState([]) ;
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);

  const fetchPosts = async () => {
    if(!userData?.$id){
      console.log('⚠ userData.$id not available');
      setPosts([]);
      setIsLoading(false);
      return;
    }

    console.log('🔍 Fetching posts for userID:', userData.$id);
    setIsLoading(true);
    try {
      const response = await service.getposts([Query.equal('userID', userData.$id)]);
      console.log('📡 API Response:', response);
      if(response && response.documents){
        console.log('✓ Own posts loaded:', response.documents.length, 'posts');
        console.log('Posts data:', response.documents.map(p => ({id: p.$id, title: p.title, userID: p.userID})));
        setPosts(response.documents);
      } else {
        console.log('⚠ Response documents not found');
        setPosts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect when user logs in
  useEffect(()=>{
    console.log('📌 Login effect triggered - authStatus:', authStatus, 'userData.$id:', userData?.$id);
    if (!authStatus || !userData?.$id) {
      console.log('⏸ Not logged in or userData not ready');
      setPosts([]);
      return;
    }

    console.log('✅ User logged in, fetching posts...');
    fetchPosts();
  },[authStatus, userData?.$id])

  // Effect for post creation/update events
  useEffect(() => {
    const handlePostEvent = () => {
      console.log('🔄 Post event detected, refetching...');
      fetchPosts();
    };
    
    window.addEventListener('postCreated', handlePostEvent);
    window.addEventListener('postUpdated', handlePostEvent);

    return () => {
      window.removeEventListener('postCreated', handlePostEvent);
      window.removeEventListener('postUpdated', handlePostEvent);
    };
  }, [userData?.$id])

  if(!authStatus){
    return (
      <div className='min-h-screen flex flex-col'>
        <Container>
          <div className='py-5 flex-1 flex items-center justify-center'>
            <h2 className='text-center text-(--text)'>Login to view your posts</h2>
          </div>
        </Container>
      </div>
    )
  }

  if(isLoading) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Container>
          <div className='py-5 flex-1 flex items-center justify-center'>
            <h2 className='text-center text-(--text)'>Loading your posts...</h2>
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
            <h2 className='text-center text-(--text)'>No posts yet</h2>
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
              content={post.body || post.content}
              featuredImage={post.image}
            />
          ))}
        </div>
      </Container>
    </div>
  )
}

export default allPost
