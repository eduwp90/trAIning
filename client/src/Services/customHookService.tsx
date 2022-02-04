import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { ISet } from "../interfaces";

const useStateWithLocalStorage = (localStorageKey: string): [number, Dispatch<SetStateAction<number>>] => {
  const number = Number(localStorage.getItem(localStorageKey));
  const [value, setValue] = useState(number || 0);
  useEffect(() => {
    localStorage.setItem(localStorageKey, value.toString());
  }, [value, localStorageKey]);
  return [value, setValue];
};

const useStateWithLocalStorageForArray = (localStorageKey: string): [ISet[], Dispatch<SetStateAction<ISet[]>>] => {
  let stringifiedArray = localStorage.getItem(localStorageKey);
  let savedWorkout;
  if (typeof stringifiedArray === "string") {
    savedWorkout = JSON.parse(stringifiedArray);
  }
  const [value, setValue] = useState(savedWorkout || []);
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value, localStorageKey]);
  return [value, setValue];
};

const useStateWithLocalStorageForBoolean = (localStorageKey: string): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const savedState = localStorage.getItem(localStorageKey);
  let savedRest;
  if (typeof savedState === "string") {
    savedRest = JSON.parse(savedState);
  }
  const [value, setValue] = useState(savedRest || false);
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value, localStorageKey]);
  return [value, setValue];
};

export { useStateWithLocalStorage, useStateWithLocalStorageForArray, useStateWithLocalStorageForBoolean };
