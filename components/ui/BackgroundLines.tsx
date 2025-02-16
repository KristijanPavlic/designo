const BackgroundLines = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 top-0 z-[-1] md:top-[-1rem]">
      <div className="container relative mx-auto h-full px-4">
        {/* 2xl and above: 6 lines */}
        <div className="hidden h-full 2xl:block">
          <div className="absolute left-4 h-full w-px bg-[var(--light-gray)]"></div>
          <div className="absolute left-[20%] h-full w-px bg-[var(--light-gray)]"></div>
          <div className="absolute left-[40%] h-full w-px bg-[var(--light-gray)]"></div>
          <div className="absolute left-[60%] h-full w-px bg-[var(--light-gray)]"></div>
          <div className="absolute left-[80%] h-full w-px bg-[var(--light-gray)]"></div>
          <div className="absolute right-4 h-full w-px bg-[var(--light-gray)]"></div>
        </div>

        {/* lg to 2xl: 4 lines */}
        <div className="hidden h-full md:block 2xl:hidden">
          <div className="absolute left-4 h-full w-px bg-[var(--light-gray)]"></div>
          <div className="absolute left-[33.33%] h-full w-px bg-[var(--light-gray)]"></div>
          <div className="absolute left-[66.66%] h-full w-px bg-[var(--light-gray)]"></div>
          <div className="absolute right-4 h-full w-px bg-[var(--light-gray)]"></div>
        </div>

        {/* sm and below: 2 lines */}
        <div className="block h-full md:hidden">
          <div className="absolute left-4 h-full w-px bg-[var(--light-gray)]"></div>
          <div className="absolute right-4 h-full w-px bg-[var(--light-gray)]"></div>
        </div>
      </div>
    </div>
  )
}

export default BackgroundLines
