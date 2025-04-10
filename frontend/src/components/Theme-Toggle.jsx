"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme =
      localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme) => {
    // For Tailwind v4, we need to set the data-theme attribute
    document.documentElement.setAttribute("data-theme", newTheme)

    // Also toggle the class for backward compatibility
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    localStorage.setItem("theme", newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-purple-600 p-0.5 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-purple-500"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span
        className="absolute inset-0 bg-white dark:bg-gray-900 rounded-full transition-all duration-200 ease-in-out"
        style={{
          clipPath: theme === "dark" ? "circle(30% at 75% 50%)" : "circle(30% at 25% 50%)",
        }}
      />
      <div className="relative flex h-full w-full items-center justify-between px-2">
        <Sun
          className={`h-5 w-5 transition-all duration-200 ${theme === "light" ? "text-yellow-500" : "text-gray-400"}`}
        />
        <Moon
          className={`h-5 w-5 transition-all duration-200 ${theme === "dark" ? "text-purple-300" : "text-gray-400"}`}
        />
      </div>
    </button>
  )
}

export default ThemeToggle
