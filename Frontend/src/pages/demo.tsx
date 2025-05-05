import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Demo() {
   const navigate=useNavigate();
   return(
    <div>  

      <button onClick={()=>{
        navigate('/checklist/update')
      }}>
        CLicke me
      </button>
    </div>
   )
}