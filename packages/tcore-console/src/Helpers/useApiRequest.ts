import axios, { AxiosError } from "axios";
import useSWR from "swr";

const fetcher = async (url: string) => {
  return axios.get(url).then((r) => r.data);
};

/**
 * Custom hook implementing an API request.
 */
function useApiRequest<T>(url: string): {
  data: T;
  error?: AxiosError;
  revalidate: () => Promise<boolean>;
  mutate: any;
} {
  const { data, error, revalidate, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if ((data as any)?.result !== undefined) {
    return { data: (data as any).result, error, revalidate, mutate };
  } else {
    return { data: data as T, error, revalidate, mutate };
  }
}

export default useApiRequest;
