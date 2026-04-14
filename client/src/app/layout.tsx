"use client"; // Add this if not present to use usePathname
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if the current path starts with /admin
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Only show Navbar if NOT an admin page */}
        {!isAdminPage && <Navbar />}
        
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Only show Footer if NOT an admin page */}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}