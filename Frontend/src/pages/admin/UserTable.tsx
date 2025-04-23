import React from 'react'
import { useEffect,useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion';
import { useAuth } from '@/hooks/AuthContext'

export default function UserTable(){
    const [users,setUsers]=useState([]);
    const [err,setErr]=useState(null);

    async function GetAllUsers(){
       try{
          const response=await axios.get('http://localhost:3000/api/user/');
         console.log(response.data);
          setUsers(response.data);
       }catch(err:any){
         setErr(err.message);
       }

    }

    
    return(
        <div>
            <div>
                <h1>Hey this is the User Portal Where you can CheckOut all the users based on there role</h1>
                <motion.div>
                    <motion.button onClick={GetAllUsers}>
                           Get All the User
                    </motion.button>

                    <motion.div>
                        {!err && users.map((user)=>{
                            <div>
                                <ul>
                                    <li>user.email</li>
                                    <li>user.role</li>
                                    <li>user.password</li>
                                </ul>
                            </div>
                        })}
                    </motion.div>
                </motion.div>
                
            </div> 
         </div>   
    )
}
