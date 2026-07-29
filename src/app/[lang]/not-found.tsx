import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[70svh] w-full max-w-[1240px] content-center px-5 py-24 sm:px-8">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4" style={{ fontSize: "var(--type-display)" }}>
        This page never shipped.
      </h1>
      <p className="lede mt-5">
        The link is broken or the work moved. Everything we have built is one click away.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/en/work" className="btn btn-primary">
          See the work
        </Link>
        <Link href="/en" className="btn btn-secondary">
          Home
        </Link>
      </div>
    </section>
  );
}
