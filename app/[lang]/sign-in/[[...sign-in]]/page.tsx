import { SignIn } from '@clerk/nextjs'

export default async function SignInPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div className="my-5 flex min-h-screen items-center justify-center bg-[var(--white)]">
      <SignIn redirectUrl={`/${lang}/dashboard`} />
    </div>
  )
}
