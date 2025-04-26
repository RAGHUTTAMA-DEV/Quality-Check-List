import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from '@/hooks/AuthContext';

export default function ItemsGet() {
    const [items, setItems] = useState<any[]>([]);  // <--- typed as array
    const [isErr, setIsErr] = useState(false);
    const navigate = useNavigate();
    
    const {token} = useAuth();

    async function getAllItems() {
        if (!token) return; // <--- wait for token to be ready

        try {
            const response = await axios.get("http://localhost:3000/api/items/items", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const fetchedItems = response.data.items || []; // fallback to empty array
            setItems(fetchedItems);
        } catch (err) {
            console.log(err);
            setIsErr(true);
        }
    }

    async function PostItem(){
        try{
            const response=await axios.post('http://localhost',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data);
        }catch(err){
            console.log(err);
            setIsErr(true);
        }
    }

    return (
        <motion.div>
            <motion.div>
                <motion.h1>Items</motion.h1>
                <motion.div>
                    <motion.button onClick={getAllItems}>
                        Get all Items
                    </motion.button>
                    {isErr && (
                        <motion.h1>Error</motion.h1>
                    )}
                    <ul>
                        {items?.map((item, index) => (
                            <li key={index}>
                                {item.name || "Unnamed item"} {/* Be safe */}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div>
                    <h1>Add Item</h1>
                    <Input placeholder='Enter Item Name' />
                    <Input placeholder='Enter items ' />
                    <Input placeholder='Enter stage ' />
                    <Button onClick={PostItem}/>
                </motion.div>

                <motion.div>
                     MarkCheckListItem
                </motion.div>

                <motion.div>
                    <motion.button onClick={() => navigate("/items/update")}>
                        Update the Item
                    </motion.button>
                </motion.div>   
            </motion.div>
        </motion.div>
    );
}
