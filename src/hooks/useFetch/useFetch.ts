import { useEffect, useState } from "react";
import { IUseFetch } from "./TypesUseFetch";

export default function useFetch<TypeData, TypeDeps>({
  url,
  deps,
}: IUseFetch<TypeDeps>) {
  const [data, setData] = useState<TypeData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`error status ${response.status}`);
    }
    const result = (await response.json()) as TypeData[];
    return result;
  };

  useEffect(() => {
    setIsLoading(true);
    getData(url)
      .then((data) => setData(data))
      .catch((error) => {
        setError(error instanceof Error ? error.message : "some error");
      })
      .finally(() => setIsLoading(false));
  }, deps);

  return {
    data,
    isLoading,
    error,
  };
}
