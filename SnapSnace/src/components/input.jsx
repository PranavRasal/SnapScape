import React ,{useId}from 'react'

const input = React.forwardRef(function input({
label,
type = "text",
className = "",
...props
},ref){
const id = useId()
return (
<div className='w-full'>
    {label && <label className='inline-block mb-1 pl-1'
    htmlFor={id}>
        {label}
        </label>}
        <input
        type={type}
        className={`px-3 py-2 rounded-lg bg-[var(--surface-2)] text-[var(--text)] outline-none
            focus:bg-[var(--surface)] duration-200 border border-[var(--border)] w-full
            ${className} `}
        ref={ref}
        {...props}
        id={id}
        />
</div>
)
})

export default input
