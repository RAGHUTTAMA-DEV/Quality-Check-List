import { useAuth } from "@/hooks/AuthContext"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function CheckList() {
  const { token } = useAuth()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [content,setContent] = useState('')
  const [comments,setcomments]=useState('');
  const [checkBy,setCheckBy]=useState('');
  const [Image,setImage]=useState('');
  const [isChecked,setIsChecked]=useState(false);
  const navigate = useNavigate()

  async function GetAllUsers() {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:3000/api/checklist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(res.data)
      setUsers(res.data.checkList)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function CreateCheckList(){
    
    setLoading(true);
    try{
      const response=await axios.post("http://localhost:3000/api/checklist",{
        content,
        comments,
        checkBy,
        Image
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log(response.data);
      

    }catch(err){
      console.log(err)
      setError(true)
    }
  }

  async function navigatefun(){
    navigate('/update')
  }
  return (
    <div>
      <motion.div>
        <h1>Checklist Form</h1>

        <motion.button onClick={GetAllUsers}>
          Get All Users
        </motion.button>

        {loading && <p>Loading...</p>}
        {error && <p>Error fetching users.</p>}

        <motion.div>
          <h2>Fetched Users</h2>
          <ul>
            {users.map((user: any, idx: number) => (
              <li key={idx}>{JSON.stringify(user)}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div>
          <h2>Create Checklist</h2>
          <Input placeholder="Enter the content" onChange={(e)=>setContent(e.target.value)} />
          <Checkbox checked={isChecked} onChange={(e)=>setIsChecked(!isChecked)} />
             Check me
          <Input placeholder="Enter the comments" onChange={(e)=>setcomments(e.target.value)} />
          <Input placeholder="Enter the checkBy" onChange={(e)=>setCheckBy(e.target.value)} />
          <Input placeholder="Enter the Image" onChange={(e)=>setImage(e.target.value)} />
          <Button onClick={CreateCheckList}>
            Create the Checklist
          </Button>
          
           
          <motion.div>
            
            <Button onClick={navigatefun}>
            Update the Checklist
            </Button>

          </motion.div> 

        </motion.div>
      </motion.div>
    </div>
  )
}
