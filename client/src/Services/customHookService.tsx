import { useState, useEffect, Dispatch, SetStateAction } from "react";

const useStateWithLocalStorage = (localStorageKey: string): [number, Dispatch<SetStateAction<number>>] => {
  const number = Number(localStorage.getItem(localStorageKey));
  const [value, setValue] = useState(number || 0);

  useEffect(() => {
    localStorage.setItem(localStorageKey, value.toString());
  }, [value, localStorageKey]);

  return [value, setValue];
};

export default useStateWithLocalStorage;
