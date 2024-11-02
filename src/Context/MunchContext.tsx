import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface Coords {
  lat: string;
  long: string;
}

export const MunchContext = createContext({
  currAddress: "",
  setCurrAddress: (location: string) => {},
  currCoords: { lat: "", long: "" },
  setCoords: (coords: Coords) => {},
  userTemplates: [
    {
      name: "",
      location: {
        lat: "",
        long: "",
      },
      choices: [""],
    },
  ],
  input1: "",
  setInput1: (input: string) => {},
  input2: "",
  setInput2: (input: string) => {},
  input3: "",
  setInput3: (input: string) => {},
  input4: "",
  setInput4: (input: string) => {},
  input5: "",
  setInput5: (input: string) => {},
  input6: "",
  setInput6: (input: string) => {},
});

interface MyProviderProps {
  children: ReactNode;
}

export const MunchProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currAddress, setCurrAddress] = useState<string>("");
  const [currCoords, setCoords] = useState<Coords>({ lat: "", long: "" });
  const [result, setResult] = useState<string>("");
  const [currChoices, setCurrChoices] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userTemplates, setUserTemplates] = useState<any>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [input1, setInput1] = useState<string>("");
  const [input2, setInput2] = useState<string>("");
  const [input3, setInput3] = useState<string>("");
  const [input4, setInput4] = useState<string>("");
  const [input5, setInput5] = useState<string>("");
  const [input6, setInput6] = useState<string>("");

  const store = {
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: (loggedIn: boolean): void => {
      setIsLoggedIn(loggedIn);
    },
    currAddress: currAddress,
    setCurrAddress: (location: string): void => {
      setCurrAddress(location);
    },
    currCoords: currCoords,
    setCoords: (coords: Coords): void => {
      setCoords(coords);
      localStorage.setItem("location", JSON.stringify(coords));
    },
    userTemplates: userTemplates,
    setUserTemplates: (templates: any): void => {
      setUserTemplates(templates);
    },
    result: result,
    setResult: (result: string): void => {
      setResult(result);
    },
    currChoices: currChoices,
    setCurrChoices: (choices: string[]): void => {
      setCurrChoices(choices);
    },
    isDrawerOpen: isDrawerOpen,
    setIsDrawerOpen: (bool: boolean): void => {
      setIsDrawerOpen(bool);
    },
    userEmail: userEmail,
    setUserEmail: (email: string): void => {
      setUserEmail(email);
    },
    selectedTemplate: selectedTemplate,
    setSelectedTemplate: (template: string): void => {
      setSelectedTemplate(template);
    },
    input1: input1,
    setInput1: (input: string): void => {
      setInput1(input);
    },
    input2: input2,
    setInput2: (input: string): void => {
      setInput2(input);
    },
    input3: input3,
    setInput3: (input: string): void => {
      setInput3(input);
    },
    input4: input4,
    setInput4: (input: string): void => {
      setInput4(input);
    },
    input5: input5,
    setInput5: (input: string): void => {
      setInput5(input);
    },
    input6: input6,
    setInput6: (input: string): void => {
      setInput6(input);
    },
  };

  useEffect(() => {
    let cachedCoords = localStorage.getItem("location");
    if (cachedCoords) {
      setCoords(JSON.parse(cachedCoords));
    }
  }, []);

  return (
    <MunchContext.Provider value={store}>{children}</MunchContext.Provider>
  );
};

export const useMunchContext = () => {
  return useContext(MunchContext);
};
