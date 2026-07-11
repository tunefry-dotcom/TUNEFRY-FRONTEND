import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import RightPanel from './RightPanel'

export default function AppLayout({ showRightPanel = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`app${showRightPanel ? '' : ' no-right-panel'}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <main className="content">
        <Outlet />
      </main>
      {showRightPanel && <RightPanel />}
    </div>
  )
}
