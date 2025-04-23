import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/AuthContext'

export default function UserTable() {
    // Initialize users as an empty array to ensure it's always an array
    const [users, setUsers] = useState<any[]>([]);
    const [err, setErr] = useState(null);
    const { token } = useAuth(); // Get the authentication token from your auth context

    async function GetAllUsers() {
        try {
            const response = await axios.get('http://localhost:3000/api/users/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            
            // Make sure we're setting an array to the state
            // If response.data is an object with users array inside, adjust accordingly
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else if (response.data && typeof response.data === 'object') {
                // If the API returns an object with a users property that is an array
                // Adjust this based on your actual API response structure
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

    return (
        <div>
            <div>
                <h1>Hey this is the User Portal Where you can CheckOut all the users based on there role</h1>
                <motion.div>
                    <motion.button onClick={GetAllUsers}>
                        Get All the User
                    </motion.button>

                    <motion.div>
                        {/* Add a check to ensure users is an array before mapping */}
                        {!err && Array.isArray(users) && users.map((user: any) => {
                            return (
                                <div key={user._id}>
                                    <h1>{user.name}</h1>
                                    <h1>{user.email}</h1>
                                    <h1>{user.role}</h1>
                                </div>
                            )
                        })}
                        {err && <div>Error: {err}</div>}
                        {/* Show a message if users is empty */}
                        {Array.isArray(users) && users.length === 0 && !err && (
                            <div>No users found</div>
                        )}
                    </motion.div>
                </motion.div>
                
            </div>
        </div>
    )
}

