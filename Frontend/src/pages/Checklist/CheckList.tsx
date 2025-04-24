import { useAuth } from "@/hooks/AuthContext"


const { token } = useAuth()
export default function ClickList(){
     return(
        <div>
            <h1>ClickListFrom</h1>
        </div>
     )
}
