// import { createContext } from "react";

// export const MyContext = createContext("");

// src/MyContext.jsx
import { createContext } from "react";

/**
 * Provide a default empty object so consumers don't crash on destructuring.
 * We'll pass actual values from App.jsx via MyContext.Provider.
 */
export const MyContext = createContext({});
