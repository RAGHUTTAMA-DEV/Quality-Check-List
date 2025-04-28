import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import {motion} from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/AuthContext'


export default function UpdatingItems(){
    const [items,setItems] = useState([])
    const [iserr,setiserr]=useState(false);
    const navigate = useNavigate()
    const {token}=useAuth();
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [status,setStatus]=useState('');
    const [isMArkClicked,setIsMarkClicked]=useState(false);

    async function UpdateCall(){
      try{
         const response=await axios.put('http://localhost:3000/api/items/update/:${title}',{
          title,
          description,
          status
         },
         {
          headers:{
            'Content-Type':'application/json',
            'Authorization':token
          }
         }
        )

      }catch(err){
        console.log(err);
        setiserr(true);
      }
    }

    async function DeleteCall(){
      try{
        const response=await axios.delete('http://localhost:3000/api/items/delete/:${title}',{
          headers:{
            'Content-Type':'application/json',
            'Authorization':token
          }
        });
        navigate('/items')

      }catch(err){
        console.log(err);
        setiserr(true);
      }
    }

    async function MarkCall(){
      try{
        const response=await axios.post('http://localhost:3000/api/items/mark/:${title}',{
          headers:{
            'Content-Type':'application/json',
            'Authorization':token
          }
        });

        navigate('/items')

      }catch(err){
        console.log(err);
        setiserr(true);
      }
    }
  return(
     <motion.div>
           <h1>Updating Items</h1>
           <form onSubmit={UpdateCall} >
              <Input placeholder='Enter the Item title' onChange={(e)=>setTitle(e.target.value)}/>
              <Input placeholder='Enter the Item description' onChange={(e)=>setDescription(e.target.value)}/>
              <Input placeholder='Enter the Item status' onChange={(e)=>setStatus(e.target.value)}/>
              
              <Button>
                 Update
              </Button>
           </form>

           {
            iserr && <motion.div>
               <h1>Error</h1>
            </motion.div>
           }

           <motion.div>
                {
                  isMArkClicked && <motion.div>
                     <Checkbox onClick={MarkCall}/>
                     <h1>Mark as Completed</h1>
                  </motion.div>
                }
           </motion.div>

           <motion.div>
             <motion.button onClick={DeleteCall}>
                 Delete Stage
             </motion.button>
           </motion.div>



     </motion.div>
  )
}
