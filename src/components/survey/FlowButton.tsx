'use client'

interface FlowButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  children: React.ReactNode
}

export default function FlowButton({
  onClick,
  disabled = false,
  isLoading = false,
  children
}: FlowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        absolute bottom-8 right-4 z-50
        px-6 py-3 rounded-full
        font-medium text-base
        transition-all duration-300
        pointer-events-auto
        ${
          disabled || isLoading
            ? 'bg-slate-600/30 border-slate-600/50 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-200 hover:scale-105 active:scale-95 cursor-pointer'
        }
        ${isLoading ? 'animate-pulse' : ''}
      `}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span>흘러가는 중...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}