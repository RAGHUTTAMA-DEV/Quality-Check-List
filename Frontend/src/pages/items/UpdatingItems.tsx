import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import {motion} from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function UpdatingItems(){
    const [items,setItems] = useState([])
    const [iserr,setiserr]=useState(false);
    const navigate = useNavigate()
    const [name,setName]=useState('')
    const [description,setDescription]=useState('')
    const [status,setStatus]=useState('')
    const [statedAt,setStatedAt]=useState('')
    const [endedAt,setEndedAt]=useState('')
    const [assignedTo,setAssignedTo]=useState('')
    async function UpdateCall(){

      try{
        const response=await axios.post('http://localhost:3000/api/items/update',{
          name:name,
          description:description,
          status:status,
          statedAt:statedAt,
          endedAt:endedAt,
          assignedTo:assignedTo
        })

        setItems(response.data)

      }catch(err){
        console.log(err)
        setiserr(true)

      }
    }
    async function Deletecall(){
      try{
        const response=await axios.delete('http://localhost:3000/api/items/delete',{
          data:{
            name:name
          }
        })
        setItems(response.data)
        //Have to Change the Backend Later

      }catch(err){
         console.log(err)
        setiserr(true)
      }
    }
  return(
     <motion.div>
           <h1>Updating Items</h1>
           <form onSubmit={UpdateCall} >
              <Input placeholder='Enter the Item name' onChange={(e)=>setName(e.target.value)}/>
              <Input placeholder='Enter the Item description' onChange={(e)=>setDescription(e.target.value)}/>
              <Input placeholder='Enter the Item status' onChange={(e)=>setStatus(e.target.value)}/>
              <Input placeholder='Enter the Item statedAt' onChange={(e)=>setStatedAt(e.target.value)}/>
              <Input placeholder='When did it ENDED' onChange={(e)=>setEndedAt(e.target.value)}/>
              <Input placeholder='Enter the Item assignedTo' onChange={(e)=>setAssignedTo(e.target.value)}/>
              <Button>
                 Update
              </Button>
           </form>

           <motion.div>
             <motion.button onClick={DeleteCall}>
                 Delete Stage
             </motion.button>
           </motion.div>

     </motion.div>
  )
}
