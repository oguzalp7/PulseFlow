
import { Providers } from "./providers";
import { UserProvider } from "@/contexts/user-context";
import Footer from "@/components/footer.component";

export const metadata = {
  title: "Pulse Flow | Welcome",
  description: "Your new periodic automation system.",
};

export default function RootLayout({ children }) {
  

  return (
    <html suppressHydrationWarning>
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
