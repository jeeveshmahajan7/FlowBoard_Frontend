import { useEffect, useState } from "react";

const useFetch = (apiUrl, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error(`❌ HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, ...dependencies]);

  return { data, loading, error };
};

export default useFetch;
