import { useCallback, useEffect, useState } from "react";

export function useApi(fetcher, dependencies = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetcher();
      setData(result);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Nao foi possivel carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    error,
    loading,
    reload: load,
    setData
  };
}
