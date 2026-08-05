"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationLinks = [
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Testimonials",
    href: "/testimonials",
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
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-cream/95 backdrop-blur-md">
      <div className="flex h-20 w-full items-center px-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="shrink-0"
          aria-label="Cornerstone Social Circle homepage"
        >
          <Image
            src="/logo/cornerstone-logo-horizontal.svg"
            alt="Cornerstone Social Circle"
            width={210}
            height={53}
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          className="ml-auto hidden items-center gap-7 lg:flex"
          aria-label="Main navigation"
        >
          {navigationLinks.map((link) => {
            const active = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition ${
                  active
                    ? "text-plum"
                    : "text-stone-600 hover:text-plum"
                }`}
              >
                {link.label}

                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform ${
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop action buttons */}
        <div className="ml-7 hidden items-center gap-3 lg:flex">
          <Link
            href="/membership"
            className="rounded-md border border-gold px-4 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-white"
          >
            Become a Member
          </Link>

          <Link
            href="/events"
            className="rounded-md bg-plum px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-plum-light"
          >
            Register for an Event
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="ml-auto inline-flex size-11 items-center justify-center rounded-md border border-stone-300 text-plum transition hover:border-gold hover:text-gold lg:hidden"
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
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
                className="rounded-md border border-gold px-5 py-3 text-center text-sm font-semibold text-gold"
              >
                Become a Member
              </Link>

              <Link
                href="/events"
                onClick={closeMobileMenu}
                className="rounded-md bg-plum px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Register for an Event
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}