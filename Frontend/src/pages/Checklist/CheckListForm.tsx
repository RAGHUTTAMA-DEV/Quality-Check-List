
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/AuthContext"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import axios from "axios"

export default function CheckListForm(){
    const [updated,setupdated]=useState();
    const [iserr,setiserr]=useState(false);
    const { token } = useAuth()
    const [content,setcontent]=useState('');
    const [checkedBy,setcheckedBy]=useState('');
    const [isChecked,setisChecked]=useState(false);
    const [comments,setcomments]=useState('');
    const [image,setimage]=useState('');

    async function updatecall(){
        try{
            const response=await axios.post('http://localhost:3000/api/checklist',{
                content,checkedBy,isChecked,comments,image
            },{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        )


        }catch(err){
            console.log(err);
            setiserr(true);
        }
    }
    return(
        <motion.div>
            <motion.div>
                <h1>Update CheckList Form</h1>

                <motion.div>
                     <Input placeholder="Enter the Updated CheckedBy" onChange={(e)=>setcheckedBy(e.target.value)}/>
                     <Input placeholder="Enter the Updated content"/>
                     <Checkbox checked={isChecked} onChange={()=>setisChecked(!isChecked)}/>
                     <Input placeholder="Enter the Updated comments" onChange={(e)=>setcomments(e.target.value)} />
                     <Input placeholder="Enter the Updated Image" onChange={(e)=>setimage(e.target.value)} />
                     <Button onClick={updatecall}>Update</Button>
                    
                     
                </motion.div>

                {iserr && <motion.div>
                    Error in Updating
                </motion.div>}
                {updated && 
                <motion.div>
                    Updated Successfully
                 </motion.div>   
                }

                
            </motion.div>
        </motion.div>
    )
}