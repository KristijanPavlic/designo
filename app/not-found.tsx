import Link from 'next/link'

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="flex items-center justify-center">
          <div className="px-6 py-12 text-center">
            <h1 className="mb-4 text-6xl font-bold text-[#1A1A1A]">404</h1>
            <h2 className="mb-2 text-2xl font-semibold text-[#1A1A1A]">
              Page Not Found
            </h2>
            <p className="mb-6 text-gray-600">
              Sorry, the page you are looking for does not exist or has been
              moved.
            </p>
            <Link
              href="/"
              className="inline-block rounded bg-[#5725F6] px-6 py-3 font-medium text-white transition-all duration-300 ease-in-out hover:bg-[#1A1A1A]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
