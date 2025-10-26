import './globals.css'

export const metadata = {
  title: 'CryptoLingo - Guess Crypto Words',
  description: 'A fun crypto word guessing game',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
