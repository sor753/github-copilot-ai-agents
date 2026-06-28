import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const AppLayout = ({ title, subtitle, children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="text-xl font-bold text-stone-900">
            DailyDots
          </Link>
          <nav className="flex gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive ? 'bg-accent-soft text-amber-900' : 'text-stone-700 hover:bg-stone-100'
                }`
              }
            >
              ホーム
            </NavLink>
            <NavLink
              to="/journal"
              end
              className={({ isActive }) =>
                `inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive ? 'bg-accent-soft text-amber-900' : 'text-stone-700 hover:bg-stone-100'
                }`
              }
            >
              マイジャーナル
            </NavLink>
            <NavLink
              to="/journal/new"
              className={({ isActive }) =>
                `inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive ? 'bg-accent-soft text-amber-900' : 'text-stone-700 hover:bg-stone-100'
                }`
              }
            >
              新規/更新
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-content flex-col gap-4 px-4 py-8">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold leading-tight text-stone-900">{title}</h1>
          {subtitle ? <p className="text-base leading-relaxed text-stone-600">{subtitle}</p> : null}
        </section>

        {children}
      </main>
    </div>
  );
};
