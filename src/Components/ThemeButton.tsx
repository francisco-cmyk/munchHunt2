import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../Context/DarkModeProvider";
import { Button } from "./Button";

export default function ThemeButton() {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <Button
      size='icon'
      variant='ghost'
      onClick={() => setIsDarkMode(!isDarkMode)}
    >
      {isDarkMode ? <Sun /> : <Moon />}
    </Button>
  );
}
