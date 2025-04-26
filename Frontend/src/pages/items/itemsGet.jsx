import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion";

export default function ItemsGet(){
 return(
     <motion.div>
         
         <motion.div>
            <motion.h1>
                Items 
            </motion.h1>
         </motion.div>
     </motion.div>
 )
}
