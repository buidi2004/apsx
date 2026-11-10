"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { RogApi } from "@/lib/api-client";
import "./RogFooter.css";

const FOOTER_LINKS = [
  { label: "GIỚI THIỆU VỀ ROG", href: "/vn/about-rog" },
  { label: "HỖ TRỢ", href: "/vn/support" },
  { label: "SO SÁNH", href: "/vn/compare" },
  { label: "TRANG CHỦ", href: "/" },
  { label: "PRODUCT GUIDE", href: "/vn/downloads" },
  { label: "NEWSROOM", href: "/vn/articles" },
];

const LEGAL_LINKS = [
  { label: "QUI CHẾ PHÁP LÝ", href: "/vn/terms-of-notice/privacy-policy" },
  { label: "THÔNG TIN HỢP PHÁP", href: "/vn/terms-of-notice/official-site" },
];

function SocialIcons() {
  return (
    <div className="rog-ft-social">
      {/* Facebook */}
      <a href="https://www.facebook.com/vn.asus.rog" target="_blank" rel="noreferrer" aria-label="Facebook">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.4h2.5l.4-2.9h-2.9V8.8c0-.84.23-1.41 1.44-1.41h1.54V4.8c-.27-.04-1.18-.11-2.24-.11-2.22 0-3.74 1.35-3.74 3.84v2.14H8v2.9h2.46V21h3.04z" /></svg>
      </a>
      {/* TikTok */}
      <a href="https://www.tiktok.com/@asusrogvn" target="_blank" rel="noreferrer" aria-label="TikTok">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.36 1.98 1.7 3.38 3.9 3.55v2.86c-1.43.14-2.8-.3-3.9-1.08v5.72c0 4.1-3.17 6.19-6.03 5.7-2.37-.4-4.32-2.35-4.32-4.92 0-2.9 2.4-5.02 5.4-4.68v2.96c-.36-.09-.72-.13-1.09-.1-1.29.1-2.24 1.1-2.15 2.35.09 1.2 1.15 2.12 2.4 2.06 1.23-.06 2.09-1 2.09-2.3V3h3.7z" /></svg>
      </a>
      {/* YouTube */}
      <a href="https://www.youtube.com/@asusrogvietnam?sub_confirmation=1" target="_blank" rel="noreferrer" aria-label="YouTube">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 00-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 002.4 7.2 26.2 26.2 0 002 12c0 1.62.13 3.23.4 4.8a2.5 2.5 0 001.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 001.76-1.77c.27-1.57.4-3.18.4-4.8s-.13-3.23-.4-4.8zM10 15.2V8.8L15.2 12 10 15.2z" /></svg>
      </a>
      {/* Instagram */}
      <a href="https://www.instagram.com/asusrogvietnam/" target="_blank" rel="noreferrer" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg>
      </a>
      {/* X */}
      <a href="https://twitter.com/ASUS_ROG" target="_blank" rel="noreferrer" aria-label="X">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.5 3zm-1.1 16.1h1.7L7.5 4.8H5.7l10.7 14.3z" /></svg>
      </a>
    </div>
  );
}

/* ROG eye paths extracted from the source wordmark svg */
function RogEye({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 37" aria-hidden focusable="false">
      <path fill="currentColor" d="M22.2 29.1c.8.5 1.6 1 2.4 1.4 8.6 3.8 21.3 6.1 23.7 5.3C55 33.6 62.5 19.5 64.8 13c0 0-7 2.8-14.1 6.1-5.9 2.8-12.4 6-12.4 6l16.5-5s-4.4 10.4-10.2 11.6c-5.8 1.2-16-2.9-16-2.9.8-.7 11.6-8.6 36.8-18.9 1.1-.8 1.8-2.1 2-3.4-5.8.6-11.4 2.3-16.7 4.8-10.6 5-28.5 17.8-28.5 17.8zM3.8 24c1.8 2.3 9.2 4.2 10.2 4.4-4.6-3.2-14-12-14-12 1 2.7 2.3 5.2 3.8 7.6z" />
      <path fill="currentColor" d="M25.6 22.9C30.5 19.3 47.9 4.6 64.7.6c0 0-8.8-1.4-21.3 2.5-4.5 1.4-11 7.7-23.1 19.4-1.6.9-7.5-2.5-10.9-4.1 0 0 5.6 8.9 7.6 11.5 3 4.1 8.5 6.5 8.5 6.5-.5-.5-4.3-4.5-5.4-6.8-.7-1.1.1-2.7 5.5-6.7z" />
    </svg>
  );
}

export default function RogFooter() {
  const [footerLinks, setFooterLinks] = useState(FOOTER_LINKS);
  const [legalLinks, setLegalLinks] = useState(LEGAL_LINKS);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");

  useEffect(() => {
    RogApi.getSiteConfig().then((cfg) => {
      if (cfg?.footer?.links && cfg.footer.links.length > 0) {
        setFooterLinks(
          cfg.footer.links.map((l) => ({
            label: l.label,
            href: l.href.startsWith("https://rog.asus.com")
              ? l.href.replace("https://rog.asus.com", "")
              : l.href,
          }))
        );
      }
      if (cfg?.footer?.legalLinks && cfg.footer.legalLinks.length > 0) {
        setLegalLinks(
          cfg.footer.legalLinks.map((l) => ({
            label: l.label,
            href: l.href.startsWith("https://rog.asus.com")
              ? l.href.replace("https://rog.asus.com", "")
              : l.href,
          }))
        );
      }
    });
  }, []);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus("Đang đăng ký...");
    try {
      const subscribed = await RogApi.subscribeNewsletter(newsletterEmail);
      setNewsletterStatus(subscribed ? "Đăng ký thành công." : "Không thể đăng ký lúc này.");
      if (subscribed) setNewsletterEmail("");
    } catch {
      setNewsletterStatus("Không thể đăng ký lúc này.");
    }
  };

  return (
    <footer className="rog-ft" id="rogFooter">
      <div className="rog-ft-inner">
        <div className="rog-ft-newsletter">
          <p className="rog-ft-newsletter-label">
            NHẬN CÁC ƯU ĐÃI MỚI NHẤT VÀ NHIỀU HƠN NỮA
          </p>
          <form className="rog-ft-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              placeholder="Nhập địa chỉ email"
              aria-label="Nhập địa chỉ email"
            />
            <button type="submit">ĐĂNG KÝ</button>
          </form>
          {newsletterStatus && <p role="status">{newsletterStatus}</p>}
        </div>

        <div className="rog-ft-links-row">
          <nav className="rog-ft-links">
            {footerLinks.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.label} href={l.href}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              )
            )}
          </nav>
          <SocialIcons />
        </div>

        <div className="rog-ft-company">
          <p>Công Ty TNHH Công Nghệ Asus (Việt Nam)</p>
          <p>Địa chỉ: 285 Cách Mạng Tháng Tám, Phường 12, Quận 10, Thành phố Hồ Chí Minh, Việt Nam</p>
          <p>
            Giấy chứng nhận đăng ký doanh nghiệp số 0304965680 do Sở Kế hoạch và
            Đầu tư và Thành phố Hồ Chí Minh cấp ngày 03/05/2007.
          </p>
          <p>Điện thoại: 1800 65 88</p>
          <p>
            Giấy phép kinh doanh hoạt động mua bán hàng hóa và các hoạt động
            liên quan trực tiếp đến mua bán hàng hóa, số 0304965680/KD-0321, do
            Sở Công thương TP. Hồ Chí Minh cấp lần đầu ngày 24/01/2019.
          </p>
          <a
            href="http://online.gov.vn/Home/WebDetails/115530"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="rog-ft-badge"
              src="/sites/rog-asus/img/misc/da-thong-bao-badge.png"
              alt="Đã thông báo Bộ Công Thương"
            />
          </a>
        </div>

        <div className="rog-ft-watermark-wrap">
          <RogEye className="rog-ft-watermark" />
        </div>

        <div className="rog-ft-divider" />

        <div className="rog-ft-bottom">
          <span className="rog-ft-region">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
            </svg>
            Vietnam/Việt Nam
          </span>
          <div className="rog-ft-legal">
            {legalLinks.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.label} href={l.href}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              )
            )}
            <span className="rog-ft-copyright">
              ©ASUSTEK COMPUTER INC. ALL RIGHTS RESERVED.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
