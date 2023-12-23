import React, { useState, useRef, useEffect } from 'react'
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { TbDeviceImacCancel } from "react-icons/tb";


const Rooms = ({ addroom,closeroom,connectedbool ,setconnectedbool}) => {
    const [roombool, setroombool] = useState(false)
    const [roomname, setroomname] = useState('')
    const inputref = useRef(null)

   useEffect(()=>{

   let sessionstoreroom =  sessionStorage.getItem('roomname')
  
   if(sessionstoreroom){
    setroomname(sessionstoreroom)
    addroom(sessionstoreroom.trim())
    setconnectedbool(true)
   }

   },[])


    const formsubmithandle = (e) => {
        e.preventDefault()
        let name = inputref.current.value
        setroombool(false)
        addroom(name.trim())
      
        setTimeout(()=>{
            setconnectedbool(prev=>{
                if(!prev){
                    setroomname('')
                    sessionStorage.removeItem('roomname')
                }
                    return prev
             });
        },1000)

        inputref.current.value = ''
        setroomname(name)
        try {
            sessionStorage.setItem('roomname', name.trim())
        } catch (err) {
            console.log(err);
        }
    }

    const roomformhandle = () => {
        
        if (roomname && connectedbool) {
            setroomname('')
            closeroom()
            sessionStorage.removeItem('roomname')
        }
        else {
            setroombool(true)
            inputref.current.focus()
        }
    }


    return (
        <>
            <div onClick={roomformhandle} className="animate_bottom absolute top-3 right-5 text-white before:absolute before:-top-3 before:left-2 before:w-2 before:h-5 before:bg-gray-400 after:absolute after:-top-3 after:right-2 after:w-2 after:h-5 after:bg-gray-400 ">
                <button className={`${roomname && connectedbool ? 'opacity-100 bg-red-500' : 'room_btn bg-blue-600 hover:rotate-[40deg]'} z-10 relative -rotate-[20deg duration-300 shadow-2xl shadow-blue-500 text-3xl p-2 rounded-full outline outline-white outline-2 max-sm:cursor-default`}>{roomname && connectedbool ? <TbDeviceImacCancel /> : <MdOutlineConnectWithoutContact />}</button>
                <div className={`absolute z-0 top-[6px] right-0 h-[34px] ${roomname && connectedbool ? 'opacity-100' : 'opacity-0 -rotate-[15deg]'}  w-max pl-3 pr-14 bg-blue-500 flex justify-start items-center text font-bold rounded-[10px_26px_26px_10px]`}>{roomname && connectedbool ? roomname : 'create room'}</div>
            </div>

            <div className={`${roombool ? ' scale-100' : 'scale-0 delay-300'} flex justify-center items-center backdrop-blur-sm absolute z-20 top-0 left-0 w-full h-full bg-[#00000083]`}>
                <div style={{ transformOrigin: 'center' }} className={`${roombool ? 'scale-100' : 'scale-0'} duration-500 w-1/3 max-sm:w-[90%] h-1/2 max-sm:h-fit px-5 max-sm:py-5 bg-[#ffffffcc]  shadow flex flex-col gap-6 justify-center items-center relative`}>

                    <div onClick={() => setroombool(false)} className="absolute cursor-pointer max-sm:cursor-default top-0 -right-[35px] max-sm:-top-9 max-sm:right-0 w-8 h-8 bg-[#ffffffa9] flex justify-center items-center">
                        <div className="w-[2px] h-5 bg-gray-600 -rotate-45 relative before:rotate-90 before:absolute before:w-full before:h-full before:bg-gray-600 before:rounded-sm rounded-sm "></div>
                    </div>

                    <div className="flex max-sm:flex-col h-[65%] gap-2 items-center">

                        <img className=" h-full max-sm:w-[70%]  aspect-square  scale-105" src="connected-photo.png" alt="connected-photo" />
                        <p className="text-[14px] font-mono text-gray-800 text-justify indent-10">You can connect with others by creating a room and others should be with the same room name and then connected ones can draw on the same drawing pad .</p>
                    </div>

                    <form onSubmit={formsubmithandle} className="flex w-full items-center justify-center gap-3">
                        <input ref={inputref} type="text" className="w-2/3 max-sm:w-[60%] py-[2px] px-4 rounded-lg outline-none border-[1px] border-gray-700 bg-transparent" placeholder="enter room name.." required />
                        <button className="bg-blue-600 outline outline-1 outline-blue-800 text-white text-sm rounded-md font-bold w-fit py-1 px-3">create room</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Rooms