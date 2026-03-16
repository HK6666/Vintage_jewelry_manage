interface ErrorBannerProps {
  message: string | null
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null
  return (
    <div className="mx-6 md:mx-8 mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
      <span className="font-medium">加载失败：</span>{message}
    </div>
  )
}
