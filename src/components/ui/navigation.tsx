"use client";

import NextLink from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { Home, User, Briefcase, Image, Mail, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════
// Fixed top-left logo — matches navbar height
// ═══════════════════════════════════════════
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

function FixedLogo() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const logoSrc = dark ? "/meshalpf-white.png" : "/logo.png";

  // Nav bar center Y = top(18) + height/2(28) = 46
  // Mobile toggle center Y = top(16) + height/2(19) = 35
  const navCenterY = 46; // desktop
  const toggleCenterY = 35; // mobile
  const logoHeightDesktop = 150;
  const logoHeightMobile = 120;

  const [logoTop, setLogoTop] = useState(navCenterY - logoHeightDesktop / 2);
  const [logoLeft, setLogoLeft] = useState(24);
  const [logoHeight, setLogoHeight] = useState(logoHeightDesktop);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      let left: number;
      if (vw >= 1024) {
        const sectionW = vw - 192;
        const contentW = Math.min(1152, sectionW);
        left = 96 + (sectionW - contentW) / 2;
      } else if (vw >= 768) {
        const sectionW = vw - 128;
        const contentW = Math.min(1152, sectionW);
        left = 64 + (sectionW - contentW) / 2;
      } else {
        left = 24;
      }
      setLogoLeft(left);

      const isDesktop = vw >= 768;
      const cy = isDesktop ? navCenterY : toggleCenterY;
      const lh = isDesktop ? logoHeightDesktop : logoHeightMobile;
      setLogoHeight(lh);
      setLogoTop(cy - lh / 2);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: logoTop,
        left: logoLeft,
        zIndex: 1001,
        height: logoHeight,
        display: "flex",
        alignItems: "center",
      }}
    >
      <NextImage
        src={logoSrc}
        alt="Meshal logo"
        width={0}
        height={0}
        sizes={`${logoHeight}px`}
        style={{ width: `${logoHeight}px`, height: "auto" }}
        priority
      />
    </motion.div>
  );
}

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Career", href: "/career", icon: Briefcase },
  { label: "Gallery", href: "/gallery", icon: Image },
  { label: "Contact", href: "/contact", icon: Mail },
];

// ═══════════════════════════════════════════
// Desktop floating glass pill — hidden on mobile
// ═══════════════════════════════════════════
function DesktopNav({ pathname }: { pathname: string }) {
  const { theme, setTheme } = useTheme();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const dark = theme === "dark";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div
      className="hidden md:flex"
      style={{
        position: "fixed",
        top: 18,
        left: 0,
        right: 0,
        zIndex: 1000,
        justifyContent: "center",
      }}
    >
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "10px 16px",
          borderRadius: 999,
          background: dark
            ? "rgba(17, 33, 45, 0.68)"
            : "rgba(210, 216, 218, 0.62)",
          backdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
          WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.08)",
          border: dark
            ? "0.5px solid rgba(155, 168, 171, 0.18)"
            : "0.5px solid rgba(255, 255, 255, 0.82)",
          boxShadow: dark
            ? "0 2px 32px rgba(0,0,0,0.35), inset 0 0.5px 0 rgba(155,168,171,0.12)"
            : "0 2px 24px rgba(0,0,0,0.10), inset 0 0.5px 0 rgba(255,255,255,0.90)",
          whiteSpace: "nowrap",
        }}
      >
      {links.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        const hovered = hoveredHref === href;
        const showBubble = active || hovered;

        const bubbleBgDark = hovered
          ? "rgba(155, 168, 171, 0.28)" : "rgba(74, 92, 106, 0.38)";
        const bubbleBgLight = hovered
          ? "rgba(255, 255, 255, 0.90)" : "rgba(255, 255, 255, 0.52)";
        const bubbleShadowDark = hovered
          ? "0 3px 16px rgba(0,0,0,0.35), inset 0 0.5px 0 rgba(155,168,171,0.30)"
          : "0 1px 6px rgba(0,0,0,0.20), inset 0 0.5px 0 rgba(155,168,171,0.14)";
        const bubbleShadowLight = hovered
          ? "0 3px 16px rgba(0,0,0,0.13), inset 0 0.5px 0 rgba(255,255,255,1)"
          : "0 1px 4px rgba(0,0,0,0.07), inset 0 0.5px 0 rgba(255,255,255,0.80)";
        const bubbleBorderDark = hovered
          ? "0.5px solid rgba(155,168,171,0.35)" : "0.5px solid rgba(155,168,171,0.16)";
        const bubbleBorderLight = hovered
          ? "0.5px solid rgba(255,255,255,1)" : "0.5px solid rgba(255,255,255,0.65)";

        return (
          <NextLink
            key={href}
            href={href}
            style={{ textDecoration: "none", position: "relative" }}
            onMouseEnter={() => setHoveredHref(href)}
            onMouseLeave={() => setHoveredHref(null)}
          >
            <motion.div
              whileTap={{ scale: 0.92 }}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 999,
                cursor: "pointer",
                zIndex: 1,
              }}
            >
              <AnimatePresence>
                {showBubble && (
                  <motion.div
                    layoutId={active && !hovered ? "active-bubble" : undefined}
                    key={hovered ? `hover-${href}` : `active-${href}`}
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: hovered ? 1.0 : 0.97 }}
                    exit={{ opacity: 0, scale: 0.82 }}
                    transition={{
                      type: "spring",
                      stiffness: hovered ? 420 : 320,
                      damping: hovered ? 22 : 28,
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      zIndex: 0,
                      background: dark ? bubbleBgDark : bubbleBgLight,
                      backdropFilter: hovered
                        ? "blur(16px) brightness(1.15)" : "blur(10px) brightness(1.05)",
                      WebkitBackdropFilter: hovered
                        ? "blur(16px) brightness(1.15)" : "blur(10px) brightness(1.05)",
                      border: dark ? bubbleBorderDark : bubbleBorderLight,
                      boxShadow: dark ? bubbleShadowDark : bubbleShadowLight,
                    }}
                  />
                )}
              </AnimatePresence>

              <Icon
                size={17}
                strokeWidth={hovered || active ? 2.2 : 1.6}
                style={{
                  position: "relative", zIndex: 1, flexShrink: 0,
                  color: hovered
                    ? dark ? "#CCD0CF" : "#06141B"
                    : active
                      ? dark ? "rgba(204,208,207,0.75)" : "rgba(6,20,27,0.70)"
                      : dark ? "rgba(204,208,207,0.38)" : "rgba(6,20,27,0.38)",
                  transition: "color 0.18s",
                }}
              />

              <span
                style={{
                  position: "relative", zIndex: 1,
                  fontSize: 14,
                  letterSpacing: "-0.2px",
                  fontWeight: hovered ? 600 : active ? 500 : 400,
                  color: hovered
                    ? dark ? "#CCD0CF" : "#06141B"
                    : active
                      ? dark ? "rgba(204,208,207,0.75)" : "rgba(6,20,27,0.70)"
                      : dark ? "rgba(204,208,207,0.38)" : "rgba(6,20,27,0.38)",
                  transition: "color 0.18s",
                }}
              >
                {label}
              </span>
            </motion.div>
          </NextLink>
        );
      })}

      {/* Divider */}
      <div style={{
        width: 0.5, height: 16, margin: "0 4px", flexShrink: 0,
        background: dark ? "rgba(155,168,171,0.20)" : "rgba(6,20,27,0.15)",
      }} />

      {/* Theme toggle */}
      <motion.button
        whileHover={{ scale: 1.12, rotate: 15 }}
        whileTap={{ scale: 0.90, rotate: -10 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={() => setTheme(dark ? "light" : "dark")}
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "7px 10px", borderRadius: 999, display: "flex",
          alignItems: "center", justifyContent: "center",
          color: dark ? "rgba(204,208,207,0.50)" : "rgba(6,20,27,0.45)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={dark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            {dark
              ? <Sun size={15} strokeWidth={1.8} />
              : <Moon size={15} strokeWidth={1.8} />
            }
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </motion.nav>
    </div>
  );
}

// ═══════════════════════════════════════════
// Mobile bottom tab bar — md:hidden, 4 tabs, no theme
// ═══════════════════════════════════════════
function MobileNav({ pathname }: { pathname: string }) {
  const { theme } = useTheme();
  const [touchedHref, setTouchedHref] = useState<string | null>(null);

  const dark = theme === "dark";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div
      className="flex md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <nav
        role="navigation"
        style={{
          width: "100%",
          background: dark ? "rgba(17,33,45,0.80)" : "rgba(180,186,186,0.72)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: dark ? "0.5px solid rgba(155,168,171,0.16)" : "0.5px solid rgba(255,255,255,0.75)",
          borderTopWidth: 0,
          borderRadius: "20px 20px 0 0",
          padding: "6px 8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {links.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            const touched = touchedHref === href;
            const showBubble = active || touched;

            return (
              <NextLink
                key={href}
                href={href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 11,
                  fontWeight: touched || active ? 600 : 400,
                  textDecoration: "none",
                  color: touched
                    ? dark ? "#CCD0CF" : "#06141B"
                    : active
                      ? dark ? "rgba(204,208,207,0.75)" : "rgba(6,20,27,0.70)"
                      : dark ? "rgba(204,208,207,0.35)" : "rgba(6,20,27,0.35)",
                  padding: "6px 12px",
                  borderRadius: 20,
                  transition: "color 0.18s",
                  position: "relative",
                }}
                onTouchStart={() => setTouchedHref(href)}
                onTouchEnd={() => setTimeout(() => setTouchedHref(null), 150)}
              >
                <AnimatePresence>
                  {showBubble && (
                    <motion.div
                      layoutId="active-bubble-mobile"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 20,
                        zIndex: 0,
                        background: dark ? "rgba(74, 92, 106, 0.55)" : "rgba(255, 255, 255, 0.80)",
                        backdropFilter: "blur(12px) brightness(1.15)",
                        WebkitBackdropFilter: "blur(12px) brightness(1.15)",
                        border: dark
                          ? "0.5px solid rgba(155,168,171,0.28)"
                          : "0.5px solid rgba(255,255,255,0.95)",
                        boxShadow: dark
                          ? "0 2px 12px rgba(0,0,0,0.28)"
                          : "0 2px 14px rgba(0,0,0,0.10)",
                      }}
                    />
                  )}
                </AnimatePresence>
                <Icon
                  size={20}
                  strokeWidth={touched || active ? 2 : 1.5}
                  style={{ position: "relative", zIndex: 1, flexShrink: 0 }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
              </NextLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════
// Mobile theme toggle — top-right corner
// ═══════════════════════════════════════════
function MobileThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <motion.button
      className="flex md:hidden"
      onClick={() => setTheme(dark ? "light" : "dark")}
      style={{
        position: "fixed", top: 16, right: 16, zIndex: 1000,
        width: 38, height: 38, borderRadius: "50%",
        background: "rgba(37,55,69,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "0.5px solid rgba(155,168,171,0.18)",
        alignItems: "center",
        justifyContent: "center", cursor: "pointer",
      }}
      whileTap={{ scale: 0.88 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={dark ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {dark
            ? <Sun size={16} color="#9BA8AB" />
            : <Moon size={16} color="#253745" />
          }
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

// ═══════════════════════════════════════════
// Export
// ═══════════════════════════════════════════
export default function Navigation() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <FixedLogo />
      <DesktopNav pathname={pathname} />
      <MobileNav pathname={pathname} />
      <MobileThemeToggle />
    </>
  );
}
