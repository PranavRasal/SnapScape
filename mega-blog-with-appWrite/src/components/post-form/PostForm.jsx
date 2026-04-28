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
  const previewImage = imagePreview || (post?.image ? service.getFilePreview(post.image) : null);
  
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
    const selectedImage = data.image?.[0];
    
    if(post){   // if post exist then update title , contend and image if user upload new one FOR EDIT POST 

     //if user upload new image then update post with new image and delete old one
      let fileId = post.image || '';
      if(selectedImage) {
        console.log('📸 Uploading new image:', selectedImage.name);
        const file = await service.uploadfile(selectedImage); 
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
          window.dispatchEvent(new Event('postUpdated'));
          navigate(`/post/${dbPost.$id}`);
        } 
  }
  else { // if post not exist then create new one with title , contend and image if user upload one  FOR CREATE POST
    
    // if user upload image then upload it and get file id else set file id to empty string
    let fileId = '';
    if(selectedImage) {
      console.log('\ud83d\udcb8 Uploading image:', selectedImage.name);
      const file = await service.uploadfile(selectedImage); 
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
      console.log('✓ Post created successfully:', dbPost.$id, 'with image:', dbPost.image);      window.dispatchEvent(new Event('postCreated'));      navigate(`/post/${dbPost.$id}`);
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

      if (name === 'image') {
        const file = value.image?.[0];
        if (!file) {
          setImagePreview(null);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }) ;
    return ()=>{
      subscription.unsubscribe();
    }
  },[watch , slugTransform , setValue])

  return (
     <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-y-6">
            <div className="w-full lg:w-2/3 px-2 space-y-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-[var(--text)] transition-colors duration-300">
                <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">Post details</h2>
                <input
                    label="Title :"
                    placeholder="Title"
                  className="mb-4 text-lg py-2"
                    {...register("title", { required: true })}
                />
                <input
                    label="Slug :"
                    placeholder="Slug"
                  className="mb-0 text-lg py-2"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-[var(--text)] transition-colors duration-300">
                <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">Message</h2>
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
              </div>
            </div>
            <div className="w-full lg:w-1/3 px-2 space-y-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-[var(--text)] transition-colors duration-300">
                <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">Featured image</h2>
                <input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {previewImage && (
                    <div className="w-full mb-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        <img
                            src={previewImage}
                            alt={post?.title || "Selected preview"}
                            className="h-auto w-full object-cover"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22256%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22256%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%236b7280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EFailed to load%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </div>
                )}
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm text-[var(--text)] transition-colors duration-300">
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
            </div>
        </form>
  );
}


