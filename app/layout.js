import './globals.css'

export const metadata = {
  title: 'Rival Regions Exchange',
  description: 'Sistema de intermediação de recursos para Rival Regions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="text-white" style={{ backgroundColor: '#3c3c3c' }}>
        {children}
      </body>
    </html>
  )
}