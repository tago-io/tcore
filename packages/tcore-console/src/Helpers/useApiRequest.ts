import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { getLocalStorage } from "./localStorage";

const fetcher = async (url: string) => {
  const token = getLocalStorage("token", "") as string;
  const headers = { token };
  return axios.get(url, { headers }).then((r) => r.data);
};

/**
 * Custom hook implementing an API request.
 */
function useApiRequest<T>(
  url: string,
  options?: any
): {
  data: T;
  error?: AxiosError;
  revalidate: () => Promise<boolean>;
  mutate: any;
} {
  const skip = options?.skip;

  const { data, error, revalidate, mutate } = useSWR<T>(skip ? null : url, fetcher, {
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
