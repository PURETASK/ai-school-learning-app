import type { ReactNode } from "react";

export function SystemPanel({ title, eyebrow, status, children }: { title: string; eyebrow: string; status?: string; children: ReactNode }) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{eyebrow}</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">{title}</h2>
        </div>
        {status ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{status}</span> : null}
      </div>
      <div className="mt-4">{children}</div>
    </article>
  );
}

export function SystemList({ items }: { items: string[] }) {
  return <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function SystemField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="mt-1 leading-6 text-slate-700">{value}</p>
    </div>
  );
}
