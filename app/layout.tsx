import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar/Navbar";
import { ClientOnly } from "./components/ClientOnly";
import { RegisterModal } from "./components/modals/RegisterModal";
import { ToasterProvider } from "./components/providers/ToasterProvider";
import { LoginModal } from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";

export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb clone",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  console.log(JSON.stringify(currentUser));
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <ClientOnly>
          <ToasterProvider />
          <RegisterModal />
          <LoginModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        {JSON.stringify(currentUser)}
        {children}
      </body>
    </html>
  );
}
