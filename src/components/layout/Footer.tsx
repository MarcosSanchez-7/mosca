import Link from "next/link";
import { Container } from "@/components/ui/Container";

const footerLinks = {
  productos: [
    { label: "Notebooks", href: "/catalog?category=notebooks" },
    { label: "Smartphones", href: "/catalog?category=smartphones" },
    { label: "Hardware", href: "/catalog?category=hardware" },
    { label: "Accesorios", href: "/catalog?category=accesorios" },
  ],
  soporte: [
    { label: "Preguntas frecuentes", href: "#" },
    { label: "Contacto", href: "#" },
    { label: "Envíos", href: "#" },
    { label: "Devoluciones", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-inverse-surface text-surface/80 mt-24">
      <Container className="py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <span className="text-surface text-xl font-black tracking-tight block">
              PixelImport
            </span>
            <p className="text-sm leading-relaxed text-surface/60">
              Tecnología importada de primer nivel, curada para el mercado local.
            </p>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-surface text-sm font-semibold uppercase tracking-widest">
              Productos
            </h3>
            <ul className="space-y-2">
              {footerLinks.productos.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-surface transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-surface text-sm font-semibold uppercase tracking-widest">
              Soporte
            </h3>
            <ul className="space-y-2">
              {footerLinks.soporte.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-surface transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-surface text-sm font-semibold uppercase tracking-widest">
              Seguinos
            </h3>
            <div className="flex gap-3">
              {["Instagram", "Twitter", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-surface/10 hover:bg-surface/20 transition-colors text-surface text-xs font-semibold"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-surface/40">
          <span>© {new Date().getFullYear()} PixelImport. Todos los derechos reservados.</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-surface/70 transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-surface/70 transition-colors">Términos</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
