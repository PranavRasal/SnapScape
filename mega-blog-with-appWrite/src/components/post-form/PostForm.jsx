import React , {useCallback, useEffect, useState} from 'react'
import {useForm } from 'react-hook-form';
import RTE from '../RTE';
import Button from '../Button';
import Select from '../Select';
import input from '../input';
import service from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import {useSelector } from 'react-redux';


export default function PostForm({post}) {
  const [imagePreview, setImagePreview] = useState(null);
  
  const {register , handleSubmit , control , watch , setValue , getValues} = useForm({
      defaultValues : {
        title : post?.title || '',
        content : post?.content || '',
        slug : post?.slug || '',
        status : post?.status || 'active',
      }
  });
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.userData);
  
  

  const submit =async (data) => {//create or edit  function create it can edit title , contend and update or add image if user not have image  
    console.log('📝 Form submitted with data:', {title: data.title, hasContent: !!data.content, contentLength: data.content?.length, slug: data.slug});
    
    if(post){   // if post exist then update title , contend and image if user upload new one FOR EDIT POST 

     //if user upload new image then update post with new image and delete old one
      let fileId = post.image || '';
      if(data.image[0]) {
        console.log('📸 Uploading new image:', data.image[0].name);
        const file = await service.uploadfile(data.image[0]); 
        if(file) {
          // delete old one if it exists
          if (post.image){
            console.log('🗑 Deleting old image:', post.image);
            await service.deletefile(post.image)
          }
          fileId = file.$id;
          console.log('\u2713 Image uploaded successfully. New FileID:', fileId);
        }
      }

      console.log('💾 Updating post with image:', fileId);
      const dbPost = await service.updatepost(post.$id ,{
        title: data.title,
        content: data.content,
        featureImage: fileId,
        status: data.status
      })
        if(dbPost){
          console.log('✓ Post updated successfully with image:', dbPost.image);
          navigate(`/post/${dbPost.$id}`);
        } 
  }
  else { // if post not exist then create new one with title , contend and image if user upload one  FOR CREATE POST
    
    // if user upload image then upload it and get file id else set file id to empty string
    let fileId = '';
    if(data.image[0]) {
      console.log('\ud83d\udcb8 Uploading image:', data.image[0].name);
      const file = await service.uploadfile(data.image[0]); 
      if(file) {
        fileId = file.$id;
        console.log('\u2713 Image uploaded successfully. FileID:', fileId);
      } else {
        console.error('\u2717 Image upload failed');
      }
    } else {
      console.warn('\u26a0 No image selected');
    }

    // create post with all required fields
    console.log('💾 Creating post with image:', fileId);
    const dbPost = await service.createpost({
      title: data.title,
      slug: data.slug,
      content: data.content,
      featureImage: fileId,
      status: data.status,
      userId: userData.$id
    })
    if(dbPost){
      console.log('✓ Post created successfully:', dbPost.$id, 'with image:', dbPost.image);
      navigate(`/post/${dbPost.$id}`);
    } else {
      console.error('\u2717 Post creation failed');
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

  // Handle image preview
  useEffect(() => {
    const watchImage = watch((data) => {
      if (data.image && data.image[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(data.image[0]);
      }
    });
    return () => watchImage.unsubscribe();
  }, [watch]);

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
                {post && post.featureImage && post.featureImage.trim() && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featureImage)}
                            alt={post.title}
                            className="rounded-lg"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22256%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22256%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%236b7280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EFailed to load%3C/text%3E%3C/svg%3E';
                            }}
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


