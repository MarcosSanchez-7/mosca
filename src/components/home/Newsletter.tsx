"use client";

import { Container } from "@/components/ui/Container";

export function Newsletter() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
            Comunidad
          </p>
          <h2 className="text-4xl font-black text-on-surface tracking-tight">
            Recibí novedades
            <br />
            y ofertas exclusivas
          </h2>
          <p className="text-on-surface-variant">
            Sé el primero en enterarte de los nuevos lanzamientos y promociones.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="tu@email.com"
              required
              className="flex-1 bg-surface-container-high text-on-surface placeholder:text-outline rounded-full px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              className="btn-gradient text-on-primary font-semibold px-6 py-4 rounded-full text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
            >
              Suscribirme
            </button>
          </form>

          <p className="text-xs text-on-surface-variant">
            Sin spam. Podés cancelar cuando quieras.
          </p>
        </div>
      </Container>
    </section>
  );
}
