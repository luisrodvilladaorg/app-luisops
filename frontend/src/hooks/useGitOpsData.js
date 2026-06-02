import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3100';
const POLL_INTERVAL = 30000;

export default function useGitOpsData() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const lastUpdatedRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gitops/applications`);

      if (!res.ok) {
        throw new Error('Failed to fetch GitOps data');
      }

      const data = await res.json();
      setApplications(data);
      setError(null);

      const now = new Date();
      setLastUpdated(now);
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

  return { applications, loading, error, lastUpdated, secondsAgo, refetch: fetchData };
}
