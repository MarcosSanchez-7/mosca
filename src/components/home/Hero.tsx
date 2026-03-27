import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-surface-container-low">
      {/* Background decorative shapes */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0071e3, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0059b5, transparent 70%)" }}
      />

      <Container className="relative z-10 py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text — 7 columns */}
          <div className="lg:col-span-7 space-y-7">
            <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
              Tecnología de vanguardia
            </p>

            <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tight text-on-surface">
              Importado.{" "}
              <br />
              <span className="text-gradient">Premium.</span>
              <br />
              Tuyo.
            </h1>

            <p className="text-lg lg:text-xl text-on-surface-variant leading-relaxed max-w-lg">
              Los mejores Notebooks, Smartphones, Hardware y Accesorios del mercado
              internacional, directo a tus manos.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/catalog"
                className="btn-gradient text-on-primary font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                Ver catálogo
              </Link>
              <Link
                href="/catalog?category=notebooks"
                className="bg-surface-container text-on-surface font-semibold px-8 py-4 rounded-full text-base hover:bg-surface-container-high active:scale-[0.98] transition-all duration-200"
              >
                Ver Notebooks
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 pt-4 border-t border-outline-variant/30">
              {[
                { label: "Productos", value: "500+" },
                { label: "Marcas", value: "40+" },
                { label: "Clientes", value: "12k+" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-on-surface">{value}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual — 5 columns */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Main floating card */}
              <div className="relative bg-surface-container-lowest rounded-[2rem] p-8 editorial-shadow">
                <div className="aspect-square bg-surface-container-low rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 80 }}>
                    laptop_mac
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">
                    Destacado
                  </div>
                  <div className="text-xl font-black text-on-surface">MacBook Pro M3</div>
                  <div className="text-gradient text-2xl font-black">$2.499.000</div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-error text-on-error text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                -11% OFF
              </div>

              {/* Floating tag */}
              <div className="absolute -bottom-4 -left-4 bg-surface-container-lowest rounded-2xl px-4 py-3 ambient-shadow flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>
                  local_shipping
                </span>
                <span className="text-xs font-semibold text-on-surface">Envío gratis</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
