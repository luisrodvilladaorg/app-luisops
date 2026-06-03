import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const POLL_INTERVAL = 300000;

export default function useMetricsData() {
  const [red, setRed] = useState(null);
  const [slo, setSlo] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const lastUpdatedRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [redRes, sloRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/api/metrics/red`),
        fetch(`${API_BASE}/api/metrics/slo`),
        fetch(`${API_BASE}/api/metrics/history`),
      ]);

      if (!redRes.ok || !sloRes.ok || !historyRes.ok) {
        throw new Error('Failed to fetch metrics data');
      }

      const [redData, sloData, historyData] = await Promise.all([
        redRes.json(),
        sloRes.json(),
        historyRes.json(),
      ]);

      setRed(redData);
      setSlo(sloData);
      setHistory(historyData);
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

  return { red, slo, history, loading, error, secondsAgo, refetch: fetchData };
}
