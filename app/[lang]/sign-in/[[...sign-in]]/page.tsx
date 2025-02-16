import { SignIn } from '@clerk/nextjs'

export default async function SignInPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--white)]">
      <div className="w-full max-w-md">
        <SignIn redirectUrl={`/${lang}/dashboard`} />
      </div>
    </div>
  )
}
