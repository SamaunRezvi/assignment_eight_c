import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { StudioImage } from "@/components/shared/studio-image";
import { CATEGORIES } from "@/lib/constants";

export function CategoryGrid() {
  return (
    <section className="border-y border-border bg-card/40 py-20" aria-labelledby="categories-title">
      <div className="page-container">
        <div className="mb-10 space-y-3 text-center">
          <p className="section-eyebrow">Browse by category</p>
          <h2 id="categories-title" className="section-title">
            Whatever you create, there is a room for it
          </h2>
          <p className="section-copy mx-auto">Jump straight to the type of space that fits your next project.</p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <li key={category.value}>
              <Link
                href={`/studios?category=${category.value}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-border"
              >
                <StudioImage
                  src={category.image}
                  alt=""
                  className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 text-white">
                  <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <category.icon className="size-5" />
                  </span>
                  <h3 className="flex items-center justify-between font-heading text-lg font-semibold !text-white">
                    {category.plural}
                    <ArrowUpRight className="size-5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </h3>
                  <p className="text-xs leading-relaxed text-white/75">{category.blurb}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
