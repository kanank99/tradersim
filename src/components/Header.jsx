import React from 'react'

function Header(props) {
  return (
    <div className='flex justify-between items-center py-4 px-8 '>
        <h1 className='glass py-3 px-2'>TraderSim</h1>
        <p className='glass py-3 px-2'>{props.cash} <span className='text-[#ffffffb3]'>USD</span></p>
    </div>
  )
}

export default Header