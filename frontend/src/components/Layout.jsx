import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({children,showSidebar}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-base-200">
      <div className='flex min-h-screen'>
      {showSidebar && <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}

        <div className="min-w-0 flex-1 flex flex-col">
          <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="w-full flex-1 overflow-y-auto">
            {children}

          </main>

        </div>

      </div>

    </div>
  )
}

export default Layout
