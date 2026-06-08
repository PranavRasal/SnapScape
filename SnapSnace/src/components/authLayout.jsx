import React ,{useState , useEffect} from 'react' 
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function Protected({children , authenticated = true}) {
    const navigate = useNavigate();
    const [loader , setLoader] = useState(true);
    const authStatus = useSelector(state => state.auth.status);
  
    useEffect(()=>{
        if (authenticated && authStatus !== authenticated) {
    navigate("/login");
} 
else if (!authenticated && authStatus !== authenticated) {
    navigate("/");
}
 setLoader(false);
    }
    ,[authStatus , navigate , authenticated])
  return loader ? <div>Loading...</div> : children;
}


