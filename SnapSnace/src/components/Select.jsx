import React ,{useId}from 'react'

function Select({
    options,
    label,
    className,
    ...props
},ref) {
  const id = useId()
  return (
    <div className='w-full'>
       {label && <label htmlFor={id}> </label>}
        <select
        {...props}
        id={id}
        ref={ref}
       className={`px-3 py-2 rounded-lg
      bg-[var(--surface-2)] text-[var(--text)] outline-none
      duration-200 border border-[var(--border)] w-full 
      ${className}`}
        >
         {options?.map((option)=>(
          <option key={option} value={option}>
            {option}
          </option>
         ))}

        </select>
     
    </div>
  )
}

export default Select
