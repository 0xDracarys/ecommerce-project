export const metadata = {
  title: 'E-Commerce Project',
  description: 'E-Commerce project with admin dashboard and store frontend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
