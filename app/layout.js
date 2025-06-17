import './globals.css'

export const metadata = {
  title: 'Rival Regions Exchange',
  description: 'Sistema de intermediação de recursos para Rival Regions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-900 text-white">
        {children}
      </body>
    </html>
  )
}