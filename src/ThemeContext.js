import { createContext, useContext } from "react";

export const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);