import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/AuthContext'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Search, RefreshCw, User, UserPlus, UsersRound, ChevronDown } from 'lucide-react';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [err, setErr] = useState<string | null>(null);
    const { token } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState('');
    const [needUpdate, setNeedUpdate] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Toggle section visibility with animation
    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    async function GetAllUsers() {
        setIsLoading(true);
        setErr(null);
        try {
            const response = await axios.get('http://localhost:3000/api/users/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else if (response.data && typeof response.data === 'object') {
                setUsers(response.data.users || []);
            } else {
                setUsers([]);
                console.error("Unexpected response format:", response.data);
            }
        } catch (err: any) {
            setErr(err.message);
            console.error("Error fetching users:", err);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function GetUser() {
        if (!username.trim()) {
          setErr("Username cannot be empty");
          return;
        }
        
        setIsLoading(true);
        setErr(null);
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
        } finally {
          setIsLoading(false);
        }
    }

    async function DeleteUser() {
        if (!username.trim()) {
            setErr("Username cannot be empty");
            return;
        }
        
        setIsLoading(true);
        setErr(null);
        try {
            const response = await axios.delete(`http://localhost:3000/api/users/delete/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            setDeleteConfirm(false);
            setErr(null);
            setUsername('');
            // Refresh user list after deletion
            GetAllUsers();
        } catch (err: any) {
            setErr(err.response?.data?.message || err.message || "Failed to delete user");
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }
      
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
                type: "spring", 
                stiffness: 300,
                damping: 24
            }
        }
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div 
            className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1 
                className="text-3xl font-bold mb-8 text-center text-blue-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                User Portal - Manage Users by Role
            </motion.h1>
            
            {/* All Users Section */}
            <motion.div 
                className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.div 
                    className="flex items-center mb-4 cursor-pointer"
                    onClick={() => toggleSection('allUsers')}
                    whileHover={{ scale: 1.01 }}
                >
                    <UsersRound className="mr-2 text-blue-500" />
                    <h2 className="text-xl font-semibold">All Users</h2>
                    <motion.div 
                        className="ml-auto origin-center"
                        animate={{ rotate: activeSection === 'allUsers' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {activeSection === 'allUsers' && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={fadeIn}
                        >
                            <motion.button 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex items-center shadow-md"
                                onClick={GetAllUsers}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <motion.div 
                                        animate={{ rotate: 360 }} 
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    >
                                        <RefreshCw size={18} className="mr-2" />
                                    </motion.div>
                                ) : (
                                    <RefreshCw size={18} className="mr-2" />
                                )}
                                {isLoading ? "Loading..." : "Get All Users"}
                            </motion.button>

                            <AnimatePresence>
                                {!err && Array.isArray(users) && users.length > 0 && (
                                    <motion.div 
                                        className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {users.map((user: User) => (
                                            <motion.div 
                                                key={user._id} 
                                                className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                                                variants={itemVariants}
                                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                            >
                                                <h2 className="font-semibold text-lg">Name: {user.username}</h2>
                                                <p className="text-gray-600">Email: {user.email}</p>
                                                <p>Role: <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{user.role}</span></p>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!err && (!Array.isArray(users) || users.length === 0) && !isLoading && (
                                <motion.div 
                                    className="mt-4 text-gray-500 bg-gray-50 p-4 rounded-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    No users found
                                </motion.div>
                            )}

                            {err && (
                                <motion.div 
                                    className="mt-4 text-red-500 bg-red-50 p-4 rounded-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Error: {err}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Find User Section */}
            <motion.div 
                className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <motion.div 
                    className="flex items-center mb-4 cursor-pointer"
                    onClick={() => toggleSection('findUser')}
                    whileHover={{ scale: 1.01 }}
                >
                    <User className="mr-2 text-blue-500" />
                    <h2 className="text-xl font-semibold">Find User by Username</h2>
                    <motion.div 
                        className="ml-auto"
                        animate={{ rotate: activeSection === 'findUser' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {activeSection === 'findUser' && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={fadeIn}
                        >
                            <div className="flex gap-2 mb-4">
                                <Input 
                                    type="text" 
                                    placeholder="Enter username" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="max-w-xs"
                                />
                                <Button 
                                    onClick={GetUser}
                                    disabled={isLoading}
                                    className="bg-blue-500 hover:bg-blue-600 flex items-center"
                                >
                                    {isLoading ? (
                                        <motion.div 
                                            animate={{ rotate: 360 }} 
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="mr-2"
                                        >
                                            <RefreshCw size={16} />
                                        </motion.div>
                                    ) : (
                                        <Search size={16} className="mr-2" />
                                    )}
                                    {isLoading ? "Searching..." : "Find User"}
                                </Button>
                            </div>

                            <AnimatePresence>
                                {user && (
                                    <motion.div 
                                        className="mt-4 border p-4 rounded-lg shadow-sm bg-white"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <h2 className="font-semibold text-lg">Name: {user.username}</h2>
                                        <p className="text-gray-600">Email: {user.email}</p>
                                        <p>Role: <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{user.role}</span></p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!user && username && err && (
                                <motion.div 
                                    className="mt-4 text-red-500 bg-red-50 p-4 rounded-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    User not found or error occurred: {err}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Update User Section */}
            <motion.div 
                className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div 
                    className="flex items-center mb-4 cursor-pointer"
                    onClick={() => toggleSection('updateUser')}
                    whileHover={{ scale: 1.01 }}
                >
                    <UserPlus className="mr-2 text-blue-500" />
                    <h2 className="text-xl font-semibold">Update User Role</h2>
                    <motion.div 
                        className="ml-auto"
                        animate={{ rotate: activeSection === 'updateUser' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {activeSection === 'updateUser' && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={fadeIn}
                        >
                            <Button 
                                onClick={() => setNeedUpdate(!needUpdate)}
                                className={needUpdate ? "bg-gray-500" : "bg-blue-500"}
                                
                                
                            >
                                {needUpdate ? "Cancel Update" : "Update User"}
                            </Button>
                            <AnimatePresence>
                                {needUpdate && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <UpdateUser token={token || ""} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Delete User Section */}
            <motion.div 
                className="bg-gray-50 rounded-lg p-6 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <motion.div 
                    className="flex items-center mb-4 cursor-pointer"
                    onClick={() => toggleSection('deleteUser')}
                    whileHover={{ scale: 1.01 }}
                >
                    <Trash2 className="mr-2 text-red-500" />
                    <h2 className="text-xl font-semibold">Delete User</h2>
                    <motion.div 
                        className="ml-auto"
                        animate={{ rotate: activeSection === 'deleteUser' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {activeSection === 'deleteUser' && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={fadeIn}
                        >
                            <div className="flex gap-2 mb-4">
                                <Input 
                                    type="text" 
                                    placeholder="Enter username to delete" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="max-w-xs"
                                />
                                <Button 
                                    onClick={() => setDeleteConfirm(true)}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    disabled={!username.trim() || isLoading}
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete User
                                </Button>
                            </div>

                            <AnimatePresence>
                                {deleteConfirm && (
                                    <motion.div 
                                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="font-medium text-red-700 mb-3">
                                            Are you sure you want to delete user "{username}"? This action cannot be undone.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={DeleteUser}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Deleting..." : "Confirm Delete"}
                                            </Button>
                                            <Button
                                                onClick={() => setDeleteConfirm(false)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {err && !deleteConfirm && (
                                <motion.div 
                                    className="mt-4 text-red-500 bg-red-50 p-4 rounded-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Error: {err}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

function UpdateUser({ token }: { token: string }) {
    const [username, setUsername] = useState('');   
    const [newRole, setNewRole] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const roles = ["admin", "user", "editor", "viewer"];

    async function Updatecall() {
        if (!username.trim()) {
            setErr("Username cannot be empty");
            return;
        }

        setIsLoading(true);
        setErr(null);
        setSuccess(null);
        
        try {
            const response = await axios.post(
                `http://localhost:3000/api/users/update/${username}`, 
                {
                    role: newRole,
                    password: password || undefined,
                    email: email || undefined
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log(response.data);
            setSuccess("User updated successfully");
            setErr(null);
            
            // Reset fields after successful update
            setPassword('');
            if (response.data?.user) {
                setNewRole(response.data.user.role);
                setEmail(response.data.user.email);
            }
        } catch (error: any) {
            console.log(error);
            setErr(error.response?.data?.message || error.message || "Failed to update user");
            setSuccess(null);
        } finally {
            setIsLoading(false);
        }
    }
   
    return (
        <motion.div 
            className="mt-4 p-6 border rounded-lg bg-white shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        > 
            <motion.div 
                className="flex flex-col gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { 
                        opacity: 1,
                        transition: { 
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <Input 
                        type="text" 
                        placeholder="Enter username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="w-full"
                    />
                </motion.div>
                
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Role</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                        {roles.map(role => (
                            <motion.div
                                key={role}
                                className={`cursor-pointer p-2 rounded-md text-center ${
                                    newRole === role 
                                        ? 'bg-blue-500 text-white shadow-md' 
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                onClick={() => setNewRole(role)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {role}
                            </motion.div>
                        ))}
                    </div>
                    <Input 
                        type="text" 
                        placeholder="Or enter custom role" 
                        value={newRole} 
                        onChange={(e) => setNewRole(e.target.value)} 
                        className="w-full" 
                    />
                </motion.div>
                
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                    <Input 
                        type="password" 
                        placeholder="Enter new password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full" 
                    />
                </motion.div>
                
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Email (optional)</label>
                    <Input 
                        type="email" 
                        placeholder="Enter new email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full" 
                    />
                </motion.div>
                
                <motion.div 
                    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    className="mt-2"
                >
                    <Button 
                        onClick={Updatecall} 
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <motion.div 
                                animate={{ rotate: 360 }} 
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="mr-2"
                            >
                                <RefreshCw size={16} />
                            </motion.div>
                        ) : null}
                        {isLoading ? "Updating..." : "Update User"}
                    </Button>
                </motion.div>
                
                <AnimatePresence>
                    {err && (
                        <motion.div 
                            className="text-red-500 bg-red-50 p-3 rounded-md"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {err}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <AnimatePresence>
                    {success && (
                        <motion.div 
                            className="text-green-500 bg-green-50 p-3 rounded-md"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}