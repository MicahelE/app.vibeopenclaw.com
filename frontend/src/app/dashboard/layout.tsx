'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff4d4d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: '/dashboard', label: 'Agents' },
    { href: '/dashboard/keys', label: 'API Keys' },
    { href: '/dashboard/billing', label: 'Billing' },
  ];

  return (
    <div className="min-h-screen bg-[#050810] text-[#f0f4ff] relative">
      <div className="stars" />
      <div className="nebula" />
      <div className="relative z-10">
        <nav className="border-b border-[rgba(136,146,176,0.15)] bg-[rgba(5,8,16,0.8)] backdrop-blur-md sticky top-0">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-6 h-6"><svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><defs><linearGradient id="nav-logo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff4d4d"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs><path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z" fill="url(#nav-logo)"/><path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z" fill="url(#nav-logo)"/><path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z" fill="url(#nav-logo)"/><circle cx="45" cy="35" r="6" fill="#050810"/><circle cx="75" cy="35" r="6" fill="#050810"/><circle cx="46" cy="34" r="2.5" fill="#00e5cc"/><circle cx="76" cy="34" r="2.5" fill="#00e5cc"/></svg></div>
                <span className="font-bold text-base text-[#f0f4ff]" style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }}>VibeOpenClaw</span>
              </Link>
              <div className="flex items-center gap-5">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs font-medium transition-colors ${
                      pathname === item.href ? 'text-[#ff4d4d]' : 'text-[#8892b0] hover:text-[#f0f4ff]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="text-xs text-[#ff4d4d] hover:text-[#ff6b6b] font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </div>
    </div>
  );
}
