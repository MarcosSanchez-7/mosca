import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { PromoConfig } from "@/lib/supabase/queries";

export function PromoSection({ config }: { config: PromoConfig }) {
  return (
    <section className="py-20">
      <Container>
        <div className="relative rounded-[2rem] overflow-hidden bg-inverse-surface px-8 md:px-16 py-16 md:py-20">
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none rounded-full"
            style={{ background: "radial-gradient(circle, #0071e3, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-12 -left-12 w-64 h-64 opacity-15 pointer-events-none rounded-full"
            style={{ background: "radial-gradient(circle, #abc7ff, transparent 70%)" }}
          />

          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold text-primary-fixed-dim uppercase tracking-[0.2em] mb-4">
              {config.badge}
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-surface leading-tight tracking-tight mb-6">
              {config.title_line1}
              <br />
              {config.title_line2}
              <br />
              <span style={{ color: "#abc7ff" }}>{config.title_line3}</span>
            </h2>
            <p className="text-surface/60 text-lg leading-relaxed mb-8 max-w-md">
              {config.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={config.cta_primary_href}
                className="btn-gradient text-on-primary font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200"
              >
                {config.cta_primary_text}
              </Link>
              <Link
                href={config.cta_secondary_href}
                className="border border-surface/20 text-surface font-semibold px-8 py-4 rounded-full text-base hover:bg-surface/10 active:scale-[0.98] transition-all duration-200"
              >
                {config.cta_secondary_text}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
