import React, { useEffect, useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App(): React.JSX.Element {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <h1 style={{ margin: 0 }}>KAVIA App</h1>

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <p>
          Current theme: <strong>{theme}</strong>
        </p>

        <a
          className="App-link"
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
