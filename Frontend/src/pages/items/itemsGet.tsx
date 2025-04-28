import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/AuthContext'

export default function ItemsGet() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState('');
  const [isErr, setIsErr] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  async function getAllItems() {
    try {
      const response = await axios.get("http://localhost:3000/api/items/items", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(response.data.items || []);
    } catch (err) {
      console.log(err);
      setIsErr(true);
    }
  }

  async function PostItem() {
    try {
      const response = await axios.post("http://localhost:3000/api/items/create", {
        name,
        description,
        stage
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      getAllItems(); // refresh list
    } catch (err) {
      console.log(err);
      setIsErr(true);
    }
  }

  return (
    <motion.div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Items Management</h1>

      <Button onClick={getAllItems}>Get All Items</Button>

      {isErr && <motion.div className="text-red-500 mt-4">Something went wrong.</motion.div>}

      <ul className="my-4">
        {items.map((item, index) => (
          <li key={index}>{item.name || "Unnamed Item"}</li>
          
        ))}
      </ul>

      <motion.div className="space-y-2 mt-8">
        <h2 className="text-xl font-semibold">Add New Item</h2>
        <Input placeholder="Enter Item Name" onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Enter Item Description" onChange={(e) => setDescription(e.target.value)} />
        <Input placeholder="Enter Stage" onChange={(e) => setStage(e.target.value)} />

        <Button onClick={PostItem}>Add Item</Button>
      </motion.div>

      <motion.div className="mt-6">
        <Button onClick={() => navigate("/items/update")}>Update an Item</Button>
      </motion.div>
    </motion.div>
  );
}
