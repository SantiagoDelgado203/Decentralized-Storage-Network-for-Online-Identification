"use client"
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Title</title>
        </head>
        <body>
            {children}
        </body>
        </html>
    )
}