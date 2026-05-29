import LoginButton from './login-button'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold">AI Carousel Maker</h1>
        <p className="text-sm text-gray-500">Sign in to start creating.</p>
      </div>

      <LoginButton />

      {searchParams.error && (
        <p className="text-sm text-red-600">
          Sign-in failed. Please try again.
        </p>
      )}
    </main>
  )
}
