import { PageHeader } from "@/components/shared/page-header";

interface LegalSection {
  title: string;
  body: string;
}

export function LegalPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={intro} />
      <div className="page-container max-w-3xl space-y-10 py-14">
        {sections.map((section, index) => (
          <section key={section.title} className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">
              {index + 1}. {section.title}
            </h2>
            <p className="leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </>
  );
}
