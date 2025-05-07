import React, { useEffect, useState } from "react";
import { fetchUserLogsCount } from "../../api/log.api"; // Adjust path if needed

export default function AddressCountCell({ userId }) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const result = await fetchUserLogsCount({ userId }); // Make sure this returns a `{ count }`
        setCount(result?.count || 0);
      } catch (error) {
        console.error("Failed to fetch address count:", error);
        setCount("N/A");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchCount();
  }, [userId]);

  return <span>{loading ? "Loading..." : count}</span>;
}
