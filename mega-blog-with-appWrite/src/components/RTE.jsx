import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';


export default function RTE({name , control , defaultValue = "" , label}) { 
  return (
    <div className='w-full'>
      {label && <label className='block mb-2 text-sm font-medium text-gray-900'>{label}</label>}
      <Controller
        name={name}
        control={control}
        render = {({field :{onChange}})=> (
            <Editor
            initialValue={defaultValue}
            init={{
                initialization: defaultValue,
                height: 500,
                menubar: true,
                plugins: [
                  "image" ,
                  "advlist" ,
                  "autolink" ,
                  "lists" ,
                  "link" ,
                    "charmap" ,
                    "anchor" ,
                    "searchreplace" ,
                    "visualblocks" ,
                    "preview" ,
                    "charmap" ,
                    "insertdatetime" ,
                    "media" ,
                    "table" ,
                    "code" ,
                    "help" ,
                    "wordcount"
                ],  
                toolbar: 'undo redo | formatselect | underline bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help' ,
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={onChange} 
        />
        )}
      />
    </div>
  )
}


