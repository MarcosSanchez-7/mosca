import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function PromoSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="relative rounded-[2rem] overflow-hidden bg-inverse-surface px-8 md:px-16 py-16 md:py-20">
          {/* Background gradient orbs */}
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
              Oferta exclusiva
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-surface leading-tight tracking-tight mb-6">
              MacBook Pro
              <br />
              M3 Pro — 11%
              <br />
              <span style={{ color: "#abc7ff" }}>OFF</span>
            </h2>
            <p className="text-surface/60 text-lg leading-relaxed mb-8 max-w-md">
              El portátil profesional de Apple con el chip M3 Pro de 11 núcleos.
              Stock limitado, oferta por tiempo limitado.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/product/macbook-pro-m3-pro-14"
                className="btn-gradient text-on-primary font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200"
              >
                Ver oferta
              </Link>
              <Link
                href="/catalog?category=notebooks"
                className="border border-surface/20 text-surface font-semibold px-8 py-4 rounded-full text-base hover:bg-surface/10 active:scale-[0.98] transition-all duration-200"
              >
                Ver Notebooks
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
