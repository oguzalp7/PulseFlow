"use client"

import { extendTheme } from "@chakra-ui/react";


const theme = extendTheme({
  fonts: {
    heading: "Ubuntu, sans-serif",
    body: "Ubuntu Sans, sans-serif",
    mono: "Ubuntu Condensed, monospace",
  },
});

export default theme;