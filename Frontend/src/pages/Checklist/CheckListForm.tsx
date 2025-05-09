import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/AuthContext"
import { motion } from "framer-motion"
import { useState } from "react"
import axios from "axios"

export default function CheckListForm() {
  const { token } = useAuth()
  const [content, setContent] = useState('')
  const [checkedBy, setCheckedBy] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [comments, setComments] = useState('')
  const [image, setImage] = useState('')
  const [updated, setUpdated] = useState(false)
  const [isErr, setIsErr] = useState(false)

  async function updatecall() {
    try {
      const response = await axios.put(`http://localhost:3000/api/checklist?content=${content}`, {
        checkedBy,
        isChecked,
        comments,
        image,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setUpdated(true);
      setIsErr(false);
    } catch (err) {
      console.log(err);
      setIsErr(true);
      setUpdated(false);
    }
  }

  async function deletecall() {
    try {
      const response = await axios.delete(`http://localhost:3000/api/checklist?content=${content}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setUpdated(true);
      setIsErr(false);
    } catch (err) {
      console.log(err);
      setIsErr(true);
      setUpdated(false);
    }
  }

  return (
    <motion.div className="p-6">
      <motion.div className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">Update or Delete Checklist</h1>

        <Input 
          placeholder="Enter Content Title of Checklist" 
          onChange={(e) => setContent(e.target.value)}
          value={content} 
        />
        <Input 
          placeholder="Enter Updated CheckedBy" 
          onChange={(e) => setCheckedBy(e.target.value)}
          value={checkedBy}
        />
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(!!checked)}
          />
          <span>Mark as Completed</span>
        </div>
        <Input 
          placeholder="Enter Updated Comments" 
          onChange={(e) => setComments(e.target.value)}
          value={comments}
        />
        <Input 
          placeholder="Enter Updated Image URL" 
          onChange={(e) => setImage(e.target.value)}
          value={image}
        />

        <div className="flex gap-4 mt-6">
          <Button onClick={updatecall}>
            Update Checklist
          </Button>
          <Button  onClick={deletecall}>
            Delete Checklist
          </Button>
        </div>

        {isErr && (
          <motion.div className="text-red-500 mt-4">
            Error updating or deleting checklist
          </motion.div>
        )}
        {updated && (
          <motion.div className="text-green-500 mt-4">
            Operation successful
          </motion.div>
        )}

      </motion.div>
    </motion.div>
  )
}
