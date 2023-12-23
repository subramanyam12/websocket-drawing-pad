import React, { useEffect, useState } from 'react'
import { MdOutlineRectangle, MdRectangle } from "react-icons/md";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { IoTriangleOutline, IoTriangle } from "react-icons/io5";
import { HiOutlineSaveAs } from "react-icons/hi";
import { MdDeleteSweep } from "react-icons/md";
import { FaEraser } from "react-icons/fa6";
import { BiSolidPencil } from "react-icons/bi";



const Toolbar = ({ setshape_size, clear,download}) => {
    const [sidebar_tools, setsidebar_tools] = useState({shape:'pen',color:'#000000',size:5})
    const [sidebar, setsidebar] = useState(false)
    

    
   useEffect(()=>{
    let localstoredtools = JSON.parse(sessionStorage.getItem('canvasdetails'))

    if(localstoredtools?.tools){
      setsidebar_tools(localstoredtools?.tools)
      setshape_size(localstoredtools?.tools) 
    } 
   },[])
    
    const shapes = [
        [MdOutlineRectangle, MdRectangle, 'rect', 'rectfill'],
        [FaRegCircle, FaCircle, 'circle', 'circlefill'],
        [IoTriangleOutline, IoTriangle, 'triangle', 'trianglefill'],
    ]

    const color_size_rangehandle = (e) => {
        let value = e.target.name==='color' ?  e.target.value :  e.target.value !== '0' ? Number(e.target.value) : 1
        setsidebar_tools(prev => ({ ...prev, [e.target.name]: value }))
        setshape_size(prev => ({ ...prev, [e.target.name]: value }))
    }

    const shapesizeclickhandle = (type) => {
        setsidebar_tools(prev => ({ ...prev, shape: type }))
        setshape_size(prev => ({ ...prev, shape: type }))
    }
  
    let timeout;
    const sidemousenter =()=>{
        timeout=setTimeout(()=>{
        setsidebar(true)
      },150)  
    }

    const sidemouseleave =()=>{
        setsidebar(false)
        clearTimeout(timeout)
    }
   
    return (
        <div onMouseEnter={sidemousenter} onMouseLeave={sidemouseleave} className={` cursor-default h-full pt-6 ${sidebar ? 'w-52' :'w-20'} over:w-52 side_transition duration-300 absolute top-0 -left-1 z-10 flex flex-col items-center text-white bg-gray-800`}>

            <div className='flex mt-7 gap-5 justify-center w-full'>
                <div onClick={() => shapesizeclickhandle('pen')} className={`shape_outer ${!sidebar && sidebar_tools?.shape === 'line' ? 'hidden' :'block'} ${sidebar_tools?.shape == 'pen' && 'outline outline-[2px] outline-[#ffffffda] bg-gray-700'}`}><BiSolidPencil /></div>
                <div onClick={() => shapesizeclickhandle('line')} className={`shape_outer show_animate ${!sidebar && sidebar_tools?.shape !== 'line' ? 'hidden' :'block'} ${sidebar_tools?.shape == 'line' && 'outline outline-[2px] outline-[#ffffffda] bg-gray-700'}`}>
                    <div className='w-1 mx-[10px] h-6 bg-white rotate-45 '></div>
                </div>
                <div className={`relative show_animate ${sidebar ? 'block' :'hidden'}`}>
                    <input type="color" name='color' onInput={color_size_rangehandle} value={sidebar_tools?.color} className='peer cursor-pointer max-sm:cursor-default h-10 w-11 rounded ' />
                    <span className='absolute -top-2 -right-[90px] hidden peer-hover:block text-xs py-1 px-2 font-bold border-[1px] bg-blue-700 rounded-lg'>color picker</span>
                </div>
            </div>

            <div className=' flex flex-col items-center w-full'>
                {
                    shapes.map(([Outline, Fill, outlinename, fillname]) => (
                        <div key={Outline} className=' flex gap-7 mt-5'>
                            <div onClick={() => shapesizeclickhandle(outlinename)} className={`shape_outer ${!sidebar && sidebar_tools?.shape === fillname ? 'hidden' :'block'} ${sidebar_tools?.shape === outlinename && 'outline outline-[2px] outline-[#ffffffda] bg-gray-700'}`}><Outline /></div>
                            <div onClick={() => shapesizeclickhandle(fillname)} className={`shape_outer show_animate ${!sidebar && sidebar_tools?.shape !== fillname ? 'hidden' :'block'} ${sidebar_tools?.shape === fillname && 'outline outline-[2px] outline-[#ffffffda] bg-gray-700'} `}><Fill /></div>
                        </div>
                    ))
                }
            </div>

            <div className=' mt-10 font-semibold font-mono' >
                <div>
                    <div className='flex gap-6 items-center justify-center '>
                        <div onClick={() => shapesizeclickhandle('eraser')} className={`shape_outer ${sidebar_tools?.shape === 'eraser' && 'outline outline-[2px] outline-[#ffffffda] bg-gray-700'}`}><FaEraser /></div>
                        <label onClick={() => shapesizeclickhandle('eraser')} style={{letterSpacing:'3px'}} className={`${sidebar_tools?.shape === 'eraser' && 'text-gray-400 font-bold'} ${sidebar ? 'flex' :'hidden'}  gap-2 justify-center items-center cursor-pointer max-sm:cursor-default`}>eraser</label>
                    </div>
                    <div className={`pl-5 mt-3 ${sidebar ? 'block' :'hidden'} w-[180px]`}>
                        <label className=' mr-5'>line width</label>
                        <small className=' w-6 inline-block '>{sidebar_tools?.size}</small><span className={`relative bottom-[1px]`}>px</span>
                        <div className='flex gap-2 items-center'>
                            <input type="range" name='size' max={200} onChange={color_size_rangehandle} value={sidebar_tools?.size} style={{ accentColor: 'blue' }} className='linewidthrange h-[5px] mt-3' />
                        </div>
                    </div>
                </div>
            </div>
 
            <div className={`bg-[#fc80808e] rounded-lg text-2xl p-2 mt-24 border-[1px] border-gray-300 ${sidebar ? 'hidden' :'block'} `}><MdDeleteSweep /></div>
            <button onClick={clear} className={`${sidebar ? 'block' :'hidden'}  mt-11  py-[6px] border-[1px] bg-[#fc80808e]  border-gray-300 font-extrabold w-[60%] rounded-lg max-sm:cursor-default`}>clear</button>

            <div className={`${sidebar ? 'hidden' :'block'} mt-4 bg-blue-600 rounded-lg text-2xl p-2 border-[1px] border-gray-300`}><HiOutlineSaveAs /></div>
            <button onClick={download} className={`${sidebar ? 'block' :'hidden'} py-[6px] mt-4 bg-blue-600 border-[1px] border-gray-300 font-extrabold w-[60%] rounded-lg max-sm:cursor-default`}>download</button>

        </div>

    )
}

export default Toolbar
