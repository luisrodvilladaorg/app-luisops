import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const POLL_INTERVAL = 30000;

export default function useClusterData() {
  const [nodes, setNodes] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const lastUpdatedRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [nodesRes, healthRes] = await Promise.all([
        fetch(`${API_BASE}/api/cluster/nodes`),
        fetch(`${API_BASE}/api/cluster/health`),
      ]);

      if (!nodesRes.ok || !healthRes.ok) {
        throw new Error('Failed to fetch cluster data');
      }

      const [nodesData, healthData] = await Promise.all([
        nodesRes.json(),
        healthRes.json(),
      ]);

      setNodes(nodesData);
      setHealth(healthData);
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

  // Fetch data + polling every 30s
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

  // Update "seconds ago" counter every second
  useEffect(() => {
    const ticker = setInterval(() => {
      if (lastUpdatedRef.current) {
        const diff = Math.floor((Date.now() - lastUpdatedRef.current.getTime()) / 1000);
        setSecondsAgo(diff);
      }
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  return { nodes, health, loading, error, lastUpdated, secondsAgo, refetch: fetchData };
}