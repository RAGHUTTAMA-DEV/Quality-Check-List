import { useAuth } from '@/hooks/AuthContext'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'

export default function Tracker() {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('');
  const [name, setName] = useState('');
  const [stage, setStage] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [isErr, setIsErr] = useState(false);

  async function CreateCall() {
    try {
      const response = await axios.post('http://localhost:3000/api/logs/create', 
      {
        message,
        action,
        name,
        stage
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      alert("Log created successfully!");
    } catch (err) {
      console.error(err);
      setIsErr(true);
    }
  }

  async function GetAllLogs() {
    try {
      const response = await axios.get('http://localhost:3000/api/logs/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setLogs(response.data.logs);
    } catch (err) {
      console.error(err);
      setIsErr(true);
    }
  }

  return (
    <motion.div className="p-6">
      <motion.h1 className="text-2xl font-bold mb-4">Tracker Page</motion.h1>

      <motion.div className="space-y-2 mb-8">
        <Input placeholder='Message' onChange={(e) => setMessage(e.target.value)} />
        <Input placeholder='Action' onChange={(e) => setAction(e.target.value)} />
        <Input placeholder='Name' onChange={(e) => setName(e.target.value)} />
        <Input placeholder='Stage' onChange={(e) => setStage(e.target.value)} />
        <Button onClick={CreateCall}>Create Log</Button>
      </motion.div>

      <motion.div>
        <h2 className="text-xl font-semibold mb-2">All Logs</h2>
        <Button onClick={GetAllLogs}>Get All Logs</Button>

        <div className="mt-4 space-y-4">
          {logs.map((log, index) => (
            <motion.div key={index} className="border p-4 rounded shadow">
              <h3>Message: {log.message}</h3>
              <h3>Action: {log.action}</h3>
              <h3>Name: {log.name}</h3>
              <h3>Stage: {log.stage}</h3>
            </motion.div>
          ))}
        </div>

        {isErr && (
          <div className="text-red-500 mt-4">Something went wrong.</div>
        )}
      </motion.div>
    </motion.div>
  );
}
