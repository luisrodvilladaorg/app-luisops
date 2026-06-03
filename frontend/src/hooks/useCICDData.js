import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const POLL_INTERVAL = 120000;

export default function useCICDData() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const lastUpdatedRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cicd/runs`);

      if (!res.ok) {
        throw new Error('Failed to fetch CI/CD data');
      }

      const data = await res.json();
      setRuns(data);
      setError(null);

      const now = new Date();
      lastUpdatedRef.current = now;
      setSecondsAgo(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialFetch = setTimeout(() => {
      fetchData();
    }, 0);
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => {
      clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, [fetchData]);

  useEffect(() => {
    const ticker = setInterval(() => {
      if (lastUpdatedRef.current) {
        const diff = Math.floor((Date.now() - lastUpdatedRef.current.getTime()) / 1000);
        setSecondsAgo(diff);
      }
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  return { runs, loading, error, secondsAgo, refetch: fetchData };
}
