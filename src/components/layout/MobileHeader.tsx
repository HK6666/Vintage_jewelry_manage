interface MobileHeaderProps {
  onMenuToggle: () => void
}

export default function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-ivory-200">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-ivory-100 cursor-pointer"
          aria-label="打开菜单"
        >
          <svg className="w-5 h-5 text-ink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span className="font-heading text-lg font-semibold text-ink-800">珍藏阁</span>
        <div className="w-9" />
      </div>
    </header>
  )
}
