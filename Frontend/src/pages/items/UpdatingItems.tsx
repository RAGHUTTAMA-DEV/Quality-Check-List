import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/AuthContext'

export default function UpdatingItems() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [isErr, setIsErr] = useState(false);

  async function UpdateCall() {
    try {
      const response = await axios.put(`http://localhost:3000/api/items/update/${title}`, {
        title,
        description,
        status
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
      setIsErr(true);
    }
  }

  async function DeleteCall() {
    try {
      const response = await axios.delete(`http://localhost:3000/api/items/delete/${title}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      navigate('/items');
    } catch (err) {
      console.log(err);
      setIsErr(true);
    }
  }

  async function MarkCall() {
    try {
      const response = await axios.post(`http://localhost:3000/api/items/mark/${title}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      navigate('/items');
    } catch (err) {
      console.log(err);
      setIsErr(true);
    }
  }

  return (
    <motion.div className="p-6">
      <h1>Updating Items</h1>

      <Input placeholder='Enter the Item Title' onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder='Enter Description' onChange={(e) => setDescription(e.target.value)} />
      <Input placeholder='Enter Status' onChange={(e) => setStatus(e.target.value)} />

      <div className="flex gap-4 my-4">
        <Button onClick={UpdateCall}>Update Item</Button>
        <Button  onClick={DeleteCall}>Delete Item</Button>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox onCheckedChange={MarkCall} />
        <span>Mark as Completed</span>
      </div>

      {isErr && <motion.div className="text-red-500 mt-4">An error occurred.</motion.div>}
    </motion.div>
  );
}
