import { Providers } from "./providers";
import { useEffect } from "react";


export const metadata = {
  title: "Pulse Flow | Welcome",
  description: "Your new periodic automation system.",
};

export default function RootLayout({ children }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").then(
          (registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          },
          (error) => {
            console.log("Service Worker registration failed:", error);
          }
        );
      });
    }
  }, []);

  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
