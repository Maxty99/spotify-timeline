import { Button } from "@heroui/react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
    const toggleTheme = () => {
        if (theme == "light") {
            setTheme("dark")
        } else {
            setTheme("light")
        }
    }
    return (
        <Button
            color="primary" onClick={toggleTheme}
            variant="bordered"
        >
            Toggle Theme
        </Button>
    )
}