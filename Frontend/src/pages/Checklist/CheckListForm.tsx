
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/AuthContext"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function CheckListForm(){
    const [updated,setupdated]=useState();
    const { token } = useAuth()
    return(
        <motion.div>
            <motion.div>
                <h1>Update CheckList Form</h1>
                
            </motion.div>
        </motion.div>
    )
}