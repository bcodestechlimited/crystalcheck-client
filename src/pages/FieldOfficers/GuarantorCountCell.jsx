import React, { useEffect, useState } from "react";
import { fetchUserLogsCount } from "../../api/log.api";

export default function GuarantorCountCell({ userId }) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const result = await fetchUserLogsCount({ userId }); // adjust based on your API
        console.log({ result });

        setCount(result?.count || 0);
      } catch (error) {
        console.error("Failed to fetch log count:", error);
        setCount("N/A");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchCount();
  }, [userId]);

  return <span>{loading ? "Loading..." : count}</span>;
}
