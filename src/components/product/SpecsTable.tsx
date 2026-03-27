interface SpecsTableProps {
  specs: Record<string, string>;
}

export function SpecsTable({ specs }: SpecsTableProps) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-black text-on-surface mb-6 tracking-tight">
        Especificaciones técnicas
      </h2>
      <div className="rounded-2xl overflow-hidden border border-outline-variant/30">
        {entries.map(([key, value], index) => (
          <div
            key={key}
            className={`grid grid-cols-2 px-6 py-4 hover:bg-surface-container transition-colors ${
              index % 2 === 0
                ? "bg-surface-container-lowest"
                : "bg-surface-container-low"
            }`}
          >
            <span className="text-sm font-semibold text-on-surface-variant capitalize">
              {key.replace(/_/g, " ")}
            </span>
            <span className="text-sm text-on-surface">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
