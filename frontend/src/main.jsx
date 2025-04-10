import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { store } from "./app/store"
import App from "./App"
import "./index.css"

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const savedTheme =
    localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

  // Set data-theme attribute for Tailwind v4
  document.documentElement.setAttribute("data-theme", savedTheme)

  // Also set class for backward compatibility
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark")
  }
}

// Run theme initialization before rendering
initializeTheme()

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
