// src/components/ThemeToggleButton.tsx
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react"; // Optional: icons
import { Button } from "@/components/ui/button"; // If you're using shadcn/ui

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button variant="outline" onClick={toggleTheme}>
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="ml-2 capitalize">{theme === "dark" ? "Light" : "Dark"} Mode</span>
    </Button>
  );
};

export default ThemeToggleButton;
