"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationLinks = [
  {
    label: "About",
    href: "/#our-story",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Services",
    href: "/services",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function isActiveLink(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#ddd5ca] bg-[#faf8f3]/97 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] w-full max-w-[1720px] items-center px-5 sm:px-7 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="shrink-0"
          aria-label="Cornerstone Social Circle homepage"
        >
          <span className="relative flex h-[60px] w-[204px] items-center sm:h-[62px] sm:w-[210px]">
            <Image
              src="/logo/cornerstone-logo-navbar-full.png"
              alt="Cornerstone Social Circle"
              width={1791}
              height={528}
              className="block h-auto w-full"
              priority
            />
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="ml-auto hidden items-center gap-6 xl:gap-9 lg:flex"
          aria-label="Main navigation"
        >
          {navigationLinks.map((link) => {
            const active = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-2 text-[15px] font-medium transition-colors ${
                  active ? "text-plum" : "text-stone-600 hover:text-plum"
                }`}
              >
                {link.label}

                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop action buttons */}
        <div className="ml-8 hidden items-center gap-4 lg:flex">
          <Link
            href="/membership"
            className="inline-flex min-h-11 items-center rounded-[5px] border border-[#a18452] bg-[#a18452] px-5 text-sm font-semibold text-[#211b18] shadow-[0_4px_12px_rgba(89,65,28,.08)] transition hover:border-[#8f7448] hover:bg-[#8f7448]"
          >
            Become a Member
          </Link>

          <Link
            href="/events"
            className="inline-flex min-h-11 items-center rounded-[5px] border border-[#312927] px-5 text-sm font-semibold text-[#312927] transition hover:bg-[#312927] hover:text-white"
          >
            Browse Events
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="group ml-auto inline-flex size-12 flex-col items-end justify-center gap-1.5 text-[#a87825] lg:hidden"
          aria-label={
            isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span className="h-[2px] w-9 bg-current transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          <span className="h-[2px] w-9 bg-current" aria-hidden="true" />
          <span className="h-[2px] w-9 bg-current transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full max-h-[calc(100vh-74px)] overflow-y-auto border-t border-[#b88935]/45 bg-[#faf8f3] px-6 pb-9 pt-8 lg:hidden"
        >
          <nav
            className="mx-auto flex max-w-lg flex-col"
            aria-label="Mobile navigation"
          >
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#657260]">
              Navigation
            </p>
            {navigationLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`flex min-h-16 items-center justify-between border-b border-[#b88935]/45 font-serif text-[1.6rem] font-medium leading-none transition-colors ${
                    active ? "text-[#9c7127]" : "text-[#292620] hover:text-[#9c7127]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-2xl font-normal text-[#b88935]" aria-hidden="true">↗</span>
                </Link>
              );
            })}

            <div className="mt-8 grid gap-3">
              <Link
                href="/membership"
                onClick={closeMobileMenu}
                className="inline-flex min-h-14 items-center justify-center border border-[#a18452] bg-[#a18452] px-5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#211b18] transition hover:bg-[#8f7448]"
              >
                Become a Member
              </Link>

              <Link
                href="/events"
                onClick={closeMobileMenu}
                className="inline-flex min-h-14 items-center justify-center border border-[#312927] px-5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#312927] transition hover:bg-[#312927] hover:text-white"
              >
                Browse Events <span className="ml-3" aria-hidden="true">→</span>
              </Link>
            </div>
            <a
              href="https://www.instagram.com/cornerstonesocialcircle/"
              target="_blank"
              rel="noreferrer"
              className="mt-8 border-t border-[#657260]/55 pt-5 text-center text-xs tracking-[0.12em] text-[#657260]"
            >
              @cornerstonesocialcircle
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
