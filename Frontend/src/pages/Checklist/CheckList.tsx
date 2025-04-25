import { useAuth } from "@/hooks/AuthContext"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function CheckList() {
  const { token } = useAuth()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  async function GetAllUsers() {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(res.data)
      setUsers(res.data.checkList)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <motion.div>
        <h1>Checklist Form</h1>

        <motion.button onClick={GetAllUsers}>
          Get All Users
        </motion.button>

        {loading && <p>Loading...</p>}
        {error && <p>Error fetching users.</p>}

        <motion.div>
          <h2>Fetched Users</h2>
          <ul>
            {users.map((user: any, idx: number) => (
              <li key={idx}>{JSON.stringify(user)}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div>
          <h2>Create Checklist</h2>
          <Input placeholder="Enter the content" />
          <Checkbox />
          <Input placeholder="Enter the comments" />
          <Input placeholder="Enter the checkBy" />
          <Input placeholder="Enter the Image" />
        </motion.div>
      </motion.div>
    </div>
  )
}
