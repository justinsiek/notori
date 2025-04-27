import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}
