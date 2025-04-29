import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/AuthContext';

export default function UpdatingItems() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [isErr, setIsErr] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState('');

  async function updateCall() {
    if (!title) {
      setIsErr(true);
      setMessage('Title is required');
      return;
    }

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
      setMessage('Item updated successfully');
      setIsErr(false);
    } catch (err) {
      console.log(err);
      setIsErr(true);
      setMessage('Failed to update item');
    }
  }

  async function deleteCall() {
    if (!title) {
      setIsErr(true);
      setMessage('Title is required');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/api/items/delete/${title}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      setMessage('Item deleted successfully');
      setIsErr(false);
      setTimeout(() => navigate('/items'), 1500);
    } catch (err) {
      console.log(err);
      setIsErr(true);
      setMessage('Failed to delete item');
    }
  }

  async function markCall(checked: boolean) {
    if (!title) {
      setIsErr(true);
      setMessage('Title is required');
      return;
    }

    setIsCompleted(checked);
    
    try {
      const response = await axios.post(`http://localhost:3000/api/items/mark/${title}`, {
        mark: checked
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      setMessage('Item marked successfully');
      setIsErr(false);
    } catch (err) {
      console.log(err);
      setIsErr(true);
      setMessage('Failed to mark item');
    }
  }

  return (
    <motion.div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update Items</h1>

      <div className="space-y-4 bg-gray-50 p-4 rounded-md mb-4">
        <Input 
          placeholder='Enter the Item Title' 
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          className="mb-2"
        />
        <Input 
          placeholder='Enter Description' 
          value={description}
          onChange={(e) => setDescription(e.target.value)} 
          className="mb-2"
        />
        <Input 
          placeholder='Enter Status' 
          value={status}
          onChange={(e) => setStatus(e.target.value)} 
          className="mb-2"
        />

        <div className="flex gap-4 my-4">
          <Button onClick={updateCall} disabled={!title}>Update Item</Button>
          <Button onClick={deleteCall} disabled={!title} variant="destructive">Delete Item</Button>
        </div>

        <div className="flex items-center gap-2 mt-4 p-2 border border-gray-200 rounded">
          <Checkbox 
            id="completed"
            checked={isCompleted}
            onCheckedChange={markCall} 
          />
          <label htmlFor="completed">Mark as Completed</label>
        </div>
      </div>

      {message && (
        <motion.div 
          className={`mt-4 p-2 rounded ${isErr ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
        >
          {message}
        </motion.div>
      )}

      <Button onClick={() => navigate('/items')} variant="outline" className="mt-4">
        Back to Items List
      </Button>
    </motion.div>
  );
}