
import { Providers } from "./providers";
import { UserProvider } from "@/contexts/user-context";


export const metadata = {
  title: "Pulse Flow | Welcome",
  description: "Your new periodic automation system.",
};

export default function RootLayout({ children }) {
  

  return (
    <html>
      <body>
        <Providers>
          <UserProvider>
            {children}
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
