
import React, { useState, useEffect, useRef } from "react"
import Toolbar from "./components/Toolbar";
import './App.css'
import Rooms from "./components/Rooms";
import Popup from "./components/Popup";


export default function Home() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const prevpoints = useRef({ x: 0, y: 0 });
  const canvasimg = useRef(null)
  const [shape_size, setshape_size] = useState({ shape: 'pen', size: 5, color: '#000000' })
  const erasermaskref = useRef(null)
  const socketref = useRef(null)
  const [connectedbool, setconnectedbool] = useState(false)
  const [popup, setpopup] = useState({msg:'',bool:true})


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight 
    context.lineCap = 'round';
    context.lineWidth = 5;
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    contextRef.current = context;

    let localdata = JSON.parse(sessionStorage.getItem('canvasdetails'));
    
    if (localdata?.canvasimg) {
      let tempimg = new Image()
      tempimg.src = localdata?.canvasimg
      tempimg.onload = () => {
        context.drawImage(tempimg, 0, 0)
      }
    }

    const beforeunloadhandle = () => {
      setshape_size(prev => {
        try {
          sessionStorage.setItem('canvasdetails', JSON.stringify({ canvasimg: canvas.toDataURL(), tools: { ...prev } }))
        } catch (err) {
          console.log(err);
        }
        return prev
      })
    }

    window.addEventListener('beforeunload', beforeunloadhandle)

    return () => {
      window.removeEventListener('beforeunload', beforeunloadhandle)
    }

  }, []);



  
  const addroom = (roomname) => {
    const socket = new WebSocket(`ws://localhost:8000/${roomname}/`);
    socketref.current = socket
    socket.onopen = (e) => {
        console.log("Socket opened!");
        setconnectedbool(true)
        setpopup({msg:'room is connected..',bool:true})
        setTimeout(()=>setpopup({msg:'',bool:true}),4000)
    }


    socket.onmessage = (e) => {
        let result = JSON.parse(e.data).message
        contextRef.current.lineWidth = result.size;
        draw_shape(result.type, result.startx, result.starty, result.endx, result.endy, result.color)
    }
    
    socket.onerror = (e) => {
        console.log('error');
        setconnectedbool(false)
        setTimeout(()=>setpopup({msg:'something error while connecting..',bool:false}),1500)
        setTimeout(()=>setpopup({msg:'',bool:true}),4000)
    }

    socket.onclose = (e) => {
        console.log("Socket closed!");
        setconnectedbool(false)
        setpopup({msg:'room is disconnected..',bool:false})
        setTimeout(()=>setpopup({msg:'',bool:true}),4000)
    }
 
  }

const closeroom = ()=>{
  socketref.current && socketref.current?.close()
}
  

  const drawwhitebackground = () => {
    contextRef.current.fillStyle = 'white';
    contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  window.addEventListener('resize', () => {
    if(!canvasRef.current)return

    if (!canvasimg.current) canvasimg.current = contextRef.current.getImageData(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height)
   
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
    contextRef.current.lineCap = 'round';
    contextRef.current.lineWidth = shape_size.size
    drawwhitebackground()
    contextRef.current.putImageData(canvasimg.current, 0, 0)
  })


  const drawline = (startx, starty, endx, endy) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(startx, starty);
    contextRef.current.lineTo(endx, endy);
    contextRef.current.stroke();
   
  }

  const drawtrinagle = (startx, starty, endx, endy, shape) => {
    contextRef.current.beginPath()
    contextRef.current.moveTo(startx, starty);
    contextRef.current.lineTo(endx, endy);
    contextRef.current.lineTo(startx * 2 - endx, endy);
    contextRef.current.closePath();
    shape === 'triangle' ? contextRef.current.stroke() : contextRef.current.fill()

  }

  const drawcircle = (startx, starty, endx, endy, shape) => {
    let radius = Math.sqrt(Math.pow(startx - endx, 2) + Math.pow(starty - endy, 2))
    contextRef.current.beginPath()
    contextRef.current.arc(startx, starty, radius, 0, 2 * Math.PI)
    shape === 'circle' ? contextRef.current.stroke() : contextRef.current.fill()
  }

  const draw_shape = (shape, startx, starty, endx, endy, color) => {

    contextRef.current.fillStyle = color
    contextRef.current.strokeStyle = color
    if (shape === 'pen') {
      drawline(startx, starty, endx, endy)
      prevpoints.current = { x: endx, y: endy }
       connectedbool && socketref.current.send(JSON.stringify({'message':{startx, starty,endx, endy,type:shape_size.shape,color,size:shape_size.size}}))
    }
    if (shape === 'line') {
      drawline(startx, starty, endx, endy)
    }
    else if (shape === 'rect') {
      contextRef.current.strokeRect(startx, starty, endx - startx, endy - starty)
    }
    else if (shape === 'rectfill') {
      contextRef.current.fillRect(startx, starty, endx - startx, endy - starty)
    }
    else if (shape === 'circle' || shape === 'circlefill') {
      drawcircle(startx, starty, endx, endy, shape)
    }
    else if (shape === 'triangle' || shape === 'trianglefill') {
      drawtrinagle(startx, starty, endx, endy, shape)
    }

  }



  const mousedownhandle = (e) => {

    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.strokeStyle = shape_size.color
    contextRef.current.fillStyle = shape_size.color
    contextRef.current.lineWidth = shape_size.size
    if (shape_size.shape !== 'pen' && shape_size.shape !== 'eraser') {
      canvasimg.current = contextRef.current.getImageData(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height)
    }

    isDrawing.current = true;
    prevpoints.current = { x: offsetX, y: offsetY }
  }

  const mousemovehandle = (e) => {

    canvasRef.current.style.cursor = shape_size.shape === 'eraser' ? 'none' :'default'
    if (shape_size.shape === 'eraser') {
    
      // erasermaskref.current.animate({
      //   left: e.clientX + 'px',
      //   top: e.clientY + 'px'
      // }, { duration: 0,fill: 'forwards' })
      erasermaskref.current.style.left=e.clientX + 'px'
      erasermaskref.current.style.top=e.clientY + 'px'
      erasermaskref.current.style.width = shape_size.size + 'px'
      erasermaskref.current.style.height = shape_size.size + 'px'
      e.buttons === 1 && contextRef.current.clearRect(e.clientX, e.clientY, shape_size.size, shape_size.size);
      return
    }

    if (!isDrawing.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    shape_size.shape !== 'pen' && contextRef.current.putImageData(canvasimg.current, 0, 0);
    draw_shape(shape_size.shape, prevpoints.current.x, prevpoints.current.y, offsetX, offsetY, shape_size.color)

    if (connectedbool && shape_size.shape !== 'pen' && shape_size.shape !== 'eraser') {
      prevpoints.current = { ...prevpoints.current, offsetX, offsetY }
    }
  };



  const onMouseUphandle = () => {
    isDrawing.current = false;
    if (canvasimg.current) canvasimg.current = undefined
    if (shape_size.shape !== 'pen' && shape_size.shape !== 'eraser') {
      connectedbool && socketref.current.send(JSON.stringify({'message':{startx:prevpoints.current.x, starty:prevpoints.current.y,endx:prevpoints.current.offsetX, endy:prevpoints.current.offsetY,type:shape_size.shape,color:shape_size.color,size:shape_size.size}}))
    }
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  }


  const clear = () => {
    contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
    sessionStorage.removeItem('canvasdetails')
    drawwhitebackground()
  }


  const download = () => {
    let link = document.createElement('a')
    link.href = canvasRef.current.toDataURL()
    link.download = `${new Date().getDay()}_${new Date().getMonth() + 1}_${new Date().getFullYear()}.jpg`
    link.click()
  }




  return (
    <div className="w-[100svw] h-[100svh] flex items-center justify-center">
      <Toolbar setshape_size={setshape_size} clear={clear} download={download} />
      
      <div ref={erasermaskref} className={`absolute pointer-events-none bg-red-500 ${shape_size.shape === 'eraser' ? 'block' : 'hidden'} border-[1px] border-gray-500`}></div>
      
      <canvas
        ref={canvasRef}
        onMouseDown={mousedownhandle}
        onMouseMove={mousemovehandle}
        onMouseUp={onMouseUphandle}
        onMouseLeave={stopDrawing}
        // className="absolute top-0 right-0"
      />

      <Rooms addroom={addroom} closeroom ={closeroom} connectedbool={connectedbool}  setconnectedbool={setconnectedbool} />
      <Popup popup={popup} />
    </div>
  )
}


