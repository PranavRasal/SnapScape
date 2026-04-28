import React from 'react'
import service from '../appwrite/config'
import {Link} from 'react-router-dom'

function Postcard({$id , title, content, featuredImage }) {
  const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22256%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22256%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%236b7280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E';
  let imageUrl = placeholderSvg;
  
  if(featuredImage && featuredImage.trim()) {
    try {
      const url = service.getFilePreview(featuredImage);
      console.log('✓ Image URL generated:', url, 'from fileID:', featuredImage);
      imageUrl = url;
    } catch(err) {
      console.error('✗ Error getting image preview for fileID:', featuredImage, err);
    }
  } else {
    console.warn('⚠ No featuredImage provided for post:', $id);
  }
  
  // Strip HTML tags and limit content length
  const stripHtml = (html) => {
    const src = html || '';
    return src.replace(/<[^>]*>/g, '').substring(0, 100) + (src.length > 100 ? '...' : '');
  };
  
  return (
   
      <Link to={`/post/${$id}`}>
      <div className='w-full rounded-xl border border-(--border) bg-(--surface) p-4 text-(--text) shadow-sm transition hover:shadow-lg'>
        <div className='justify-center w-full mb-4'>
        <img src={imageUrl} alt={title} className='w-full h-64 object-cover rounded-xl mt-4' onError={(e) => {
          console.error('✗ Image failed to load:', imageUrl);
          e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22256%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22256%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%236b7280%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EFailed to load%3C/text%3E%3C/svg%3E';
        }} />
        </div>
        <h2 className='text-xl font-bold mb-3 text-center text-(--text)'>{title}</h2>
        {content && <p className='text-sm text-center text-(--muted)'>{stripHtml(content)}</p>}
      </div>
      </Link>
     
   
  )
}

export default Postcard
