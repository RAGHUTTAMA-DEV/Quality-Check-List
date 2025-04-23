import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/AuthContext'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

export default function UserTable() {
    // Initialize users as an empty array to ensure it's always an array
    const [users, setUsers] = useState<User[]>([]);
    const [err, setErr] = useState<string | null>(null);
    const { token } = useAuth();
    const [user, setUser] = useState<User | null>(null); // Fixed initialization
    const [username, setUsername] = useState(''); // Added missing username state

    async function GetAllUsers() {
        try {
            const response = await axios.get('http://localhost:3000/api/users/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            
            // Make sure we're setting an array to the state
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else if (response.data && typeof response.data === 'object') {
                // If the API returns an object with a users property that is an array
                setUsers(response.data.users || []);
            } else {
                // Fallback to empty array if response is not as expected
                setUsers([]);
                console.error("Unexpected response format:", response.data);
            }
        } catch (err: any) {
            setErr(err.message);
            console.error("Error fetching users:", err);
            // Reset users to empty array on error
            setUsers([]);
        }
    }

    async function GetUser() {
        if (!username.trim()) {
          setErr("Username cannot be empty");
          return;
        }
      
        try {
          const response = await axios.get(`http://localhost:3000/api/users/get/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
      
          if (response.data && typeof response.data === 'object' && response.data.user) {
            setUser(response.data.user);
            setErr(null);
          } else {
            setUser(null);
            setErr("Invalid response format");
          }
        } catch (err: any) {
          console.log(err);
          setErr(err.response?.data?.message || err.message || "Something went wrong");
          setUser(null);
        }
      }
      
    return (
        <div className="p-6">
            <div>
                <h1 className="text-2xl font-bold mb-6">User Portal - Manage Users by Role</h1>
                
                <motion.div className="mb-8">
                    <motion.button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={GetAllUsers}
                    >
                        Get All Users
                    </motion.button>

                    <motion.div className="mt-4">
                        {/* Add a check to ensure users is an array before mapping */}
                        {!err && Array.isArray(users) && users.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {users.map((user: User) => (
                                    <div key={user._id} className="border p-4 rounded shadow">
                                        <h2 className="font-semibold">Name: {user.username}</h2>
                                        <p>Email: {user.email}</p>
                                        <p>Role: {user.role}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !err && <div>No users found</div>
                        )}
                        {err && <div className="text-red-500">Error: {err}</div>}
                    </motion.div>
                </motion.div>

                <motion.div className="mt-8 border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Find User by Username</h2>
                    <div className="flex gap-2 mb-4">
                        <Input 
                            type="text" 
                            placeholder="Enter username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="max-w-xs"
                        />
                        <Button onClick={GetUser}>
                            Find User
                        </Button>
                    </div>

                    <motion.div className="mt-4">
                        {user && (
                            <div className="border p-4 rounded shadow">
                                <h2 className="font-semibold">Name: {user.username}</h2>
                                <p>Email: {user.email}</p>
                                <p>Role: {user.role}</p>
                            </div>
                        )}
                        {!user && username && err && (
                            <div className="text-red-500">User not found or error occurred: {err}</div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
