
import { Providers } from "./providers";



export const metadata = {
  title: "Pulse Flow | Welcome",
  description: "Your new periodic automation system.",
};

export default function RootLayout({ children }) {
  

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
