import { useAuth } from "@/hooks/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

interface Stage {
  _id: string;
  name: string;
  // Add other fields as per your backend response
}

export default function UserDash(): JSX.Element {
  const { token, user } = useAuth();
  const [stages, setStages] = useState<Stage[]>([]);

  useEffect(() => {
    if (!user || !token) return; // prevent undefined _id error

    async function fetchAssignedStages() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/checklist/assigned?userId=${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStages(res.data.stages);
      } catch (error) {
        console.error("Error fetching assigned stages:", error);
      }
    }

    fetchAssignedStages();
  }, [user, token]);

  if (!user || !token) {
    return <div>Loading...</div>; // Or redirect/login message
  }

  return (
    <div>
      <h1>Your Assigned Stages</h1>
      <ul>
        {stages.map((stage) => (
          <li key={stage._id}>{stage.name}</li>
        ))}
      </ul>
    </div>
  );
}
    