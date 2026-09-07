"use client";

import { Menu, X } from "lucide-react";
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
          className="ml-auto inline-flex size-10 items-center justify-center rounded-[5px] border border-stone-300 text-plum transition hover:border-gold hover:text-gold lg:hidden"
          aria-label={
            isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? (
            <X aria-hidden="true" size={22} />
          ) : (
            <Menu aria-hidden="true" size={22} />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-stone-200 bg-cream px-5 py-6 lg:hidden"
        >
          <nav
            className="mx-auto flex max-w-7xl flex-col"
            aria-label="Mobile navigation"
          >
            {navigationLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`border-b border-stone-200 py-4 text-base font-medium ${
                    active ? "text-gold" : "text-plum"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-6 grid gap-3">
              <Link
                href="/membership"
                onClick={closeMobileMenu}
                className="rounded-md border border-[#a18452] bg-[#a18452] px-5 py-3 text-center text-sm font-semibold text-[#211b18]"
              >
                Become a Member
              </Link>

              <Link
                href="/events"
                onClick={closeMobileMenu}
                className="rounded-md border border-[#312927] px-5 py-3 text-center text-sm font-semibold text-[#312927]"
              >
                Browse Events
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
