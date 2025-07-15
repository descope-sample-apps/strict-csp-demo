import { AuthProvider } from "@descope/nextjs-sdk";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <AuthProvider projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID!}>{children}</AuthProvider>
      </body>
    </html>
  );
}
