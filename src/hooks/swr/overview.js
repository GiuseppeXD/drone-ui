import useSWR from 'swr';

const POLL_INTERVAL = 15000;

const useSystemOverview = (enabled = false) => {
  const {
    data, error, mutate,
  } = useSWR(enabled ? '/api/system/overview' : null, {
    refreshInterval: enabled ? POLL_INTERVAL : 0,
  });

  return {
    data,
    mutate,
    isError: error,
    isLoading: enabled && !error && !data,
  };
};

export default useSystemOverview;
