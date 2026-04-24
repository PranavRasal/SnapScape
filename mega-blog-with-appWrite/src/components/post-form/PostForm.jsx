import React , {useCallback,useEffect} from 'react'
import {useForm } from 'react-hook-form';
import RTE from '../RTE';
import Button from '../Button';
import Select from '../Select';
import input from '../input';
import service from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import {useSelector } from 'react-redux';


export default function PostForm({post}) {
  const {register , handleSubmit , control , watch , setValue , getValues} = useForm({
      defaultValues : {
        title : post?.title || '',
        contend : post?.contend || '',
        slug : post?.slug || '',
        status : post?.status || 'active',
      }
  });
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.userData);
  
  

  const submit =async (data) => {//create or edit  function create it can edit title , contend and update or add image if user not have image  
    
    if(post){   // if post exist then update title , contend and image if user upload new one FOR EDIT POST 

     //if user upload new image then update post with new image and delete old one
      const file = data.image[0] ? service.uploadfile(data.image[0]) : null; 

      // delete old one
      if (file){
      service.deletefile(post.featureImage)
      }

    const dbPost = await service.updatepost(post.$id ,{...data ,
          featureImage : file ? file.$id : undefined 
          // if user  upload new image then update post with new image id else keep old one
      })
        if(dbPost){
          navigate(`/post/${dbPost.$id}`);
        } 
  }
  else { // if post not exist then create new one with title , contend and image if user upload one  FOR CREATE POST
    
    // if user upload image then upload it and get file id else set file id to null
    const file = data.image[0] ? service.uploadfile(data.image[0]) : null; 

    if(file){
      data.featureImage = file.$id; // set featureImage to file id if user upload image
      const dbPost = await service.createpost({...data , 
        userId : userData.$id // set userId to current user id
        })
        if(dbPost){
          navigate(`/post/${dbPost.$id}`);
        }
    }
  }


  }
  
  const slugTransform = useCallback((value) => {// transform title to slug and given unnecessary characters and set slug value to transformed title

    if(value && typeof value === 'string'){
      return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'); // replace spaces and special characters with hyphens
    }
  return '';
  },[]) 

  useEffect(()=>{
    const subscription = watch((value , {name})=>{
      if(name === 'title'){
        const slug = slugTransform (value.title ,{shouldValidate : true});
        setValue('slug' , slug);
      }
    }) ;
    return ()=>{
      subscription.unsubscribe();
    }
  },[watch , slugTransform , setValue])

  return (
     <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
  );
}


