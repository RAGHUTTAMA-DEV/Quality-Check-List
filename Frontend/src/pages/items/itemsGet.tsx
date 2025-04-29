import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/AuthContext';

export default function ItemsGet() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStageId, setSelectedStageId] = useState('');
  const [isErr, setIsErr] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  // Load items on component mount
  useEffect(() => {
    getAllItems();
  }, []);

  async function getAllItems() {
    try {
      const response = await axios.get("http://localhost:3000/api/items/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(response.data.items || []);
      setIsErr(false);
    } catch (err) {
      console.log(err);
      setIsErr(true);
    }
  }

  async function postItem() {
    try {
      await axios.post("http://localhost:3000/api/items", {
        title: name,
        items: [], // Empty array for now
        stage: selectedStageId,
        description: description
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Clear form
      setName('');
      setDescription('');
      setSelectedStageId('');
      
      // Refresh the list
      getAllItems();
    } catch (err) {
      console.log(err);
      setIsErr(true);
    }
  }

  return (
    <motion.div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Items Management</h1>

      <Button onClick={getAllItems} className="mb-4">Refresh Items</Button>

      {isErr && <motion.div className="text-red-500 mt-4">Something went wrong.</motion.div>}

      <ul className="my-4 bg-gray-100 p-4 rounded-md">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={item._id || index} className="py-2 border-b border-gray-200">
              <div className="font-medium">{item.title || "Unnamed Item"}</div>
              {item.description && <div className="text-sm text-gray-600">{item.description}</div>}
            </li>
          ))
        ) : (
          <li className="py-2 text-gray-500">No items found</li>
        )}
      </ul>

      <motion.div className="space-y-2 mt-8 bg-gray-50 p-4 rounded-md">
        <h2 className="text-xl font-semibold">Add New Item</h2>
        <Input 
          placeholder="Enter Item Name" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
        <Input 
          placeholder="Enter Item Description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)} 
        />
        <Input 
          placeholder="Enter Stage ID" 
          value={selectedStageId}
          onChange={(e) => setSelectedStageId(e.target.value)} 
        />

        <Button onClick={postItem} disabled={!name || !selectedStageId}>
          Add Item
        </Button>
      </motion.div>

      <motion.div className="mt-6">
        <Button onClick={() => navigate("/items/update")}>Update Items</Button>
      </motion.div>
    </motion.div>
  );
}