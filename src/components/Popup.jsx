import React from 'react'

const Popup = ({popup}) => {
  return (
    <div className={`${popup?.msg && 'error_popup'} absolute bottom-0 opacity-0 invisible right-14 px-7 h-11 bg-gray-300 rounded shadow-sm grid place-items-center`}>
        <p className={`${popup?.bool ? 'text-green-600' :'text-red-500'}  font-semibold `}>{popup?.msg}</p>
        <div className={`${popup?.bool ? 'bg-green-600' :'bg-red-500'} absolute bottom-0 left-0 h-1 w-full`}></div>
    </div>
  )
}

export default Popup