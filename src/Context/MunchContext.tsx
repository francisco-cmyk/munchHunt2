import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";

export type Coordinate = {
  latitude: string;
  longitude: string;
};

export const MunchContext = createContext({
  currentAddress: "",
  setCurrentAddress: (location: string) => {},
  currentCoordinates: { latitude: "", longitude: "" },
  setCoordinates: (coords: Coordinate) => {},
  munchHuntChoice: "",
  setMunchHuntChoice: (choice: string) => {},
});

interface MyProviderProps {
  children: ReactNode;
}

export const MunchProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [currentCoordinates, setCoordinates] = useState<Coordinate>({
    latitude: "",
    longitude: "",
  });
  const [result, setResult] = useState<string>("");
  const [munchHuntChoice, setMunchHuntChoice] = useState<string>("");

  const store = {
    currentAddress: currentAddress,
    setCurrentAddress: (location: string): void => {
      setCurrentAddress(location);
    },
    currentCoordinates: currentCoordinates,
    setCoordinates: (coords: Coordinate): void => {
      setCoordinates(coords);
      localStorage.setItem("location", JSON.stringify(coords));
    },
    result: result,
    setResult: (result: string): void => {
      setResult(result);
    },
    munchHuntChoice: munchHuntChoice,
    setMunchHuntChoice: (choice: string) => {
      setMunchHuntChoice(choice);
    },
  };

  useEffect(() => {
    let cachedCoords = localStorage.getItem("location");
    let cachedChoice = localStorage.getItem("choice");
    if (cachedCoords) {
      setCoordinates(JSON.parse(cachedCoords));
    }
    if (cachedChoice) {
      setMunchHuntChoice(cachedChoice);
    }
  }, []);

  return (
    <MunchContext.Provider value={store}>{children}</MunchContext.Provider>
  );
};

export const useMunchContext = () => {
  return useContext(MunchContext);
};
