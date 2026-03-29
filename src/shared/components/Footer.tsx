export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left sm:px-6">
        <p>HomeVision technical challenge · demo UI only</p>
        <p className="sm:text-right">
          Data from{' '}
          <a
            href="https://staging.homevision.co"
            className="underline underline-offset-2 hover:text-foreground"
            target="_blank"
            rel="noreferrer noopener"
          >
            staging.homevision.co
          </a>
        </p>
      </div>
    </footer>
  )
}
