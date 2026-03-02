import Link from "next/link";
import Image from "next/image";
import ContactForm from "./ContactForm";

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <Link href="/" aria-label="Vickie's Atelier Home">
              <Image
                src="/images/logo/va-logo.png"
                alt="Vickie's Atelier"
                width={100}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </Link>
          </div>
          <p className="muted" style={{ marginTop: 12 }}>
            Lagos &bull; By appointment only
          </p>
          <p>
            <a href="mailto:hello@vickiesatelier.com">
              hello@vickiesatelier.com
            </a>
            <br />
            <a href="tel:+2348000000000">+234 800 000 0000</a>
          </p>
          <div className="socials" aria-label="Social Links">
            <a href="#" aria-label="Instagram" title="Instagram">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm11 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 7a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
              </svg>
            </a>
            <a href="#" aria-label="Pinterest" title="Pinterest">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.04 2C6.56 2 3 5.92 3 10.22c0 2.5 1.4 5.6 3.64 6.58.34.16.26-.08.5-1.02.05-.2.25-.96.25-.96.12.24.5.46.9.46 1.18 0 2.02-1.08 2.02-2.64 0-1.4-.98-2.38-2.38-2.38-.82 0-1.44.54-1.44 1.3 0 .78.5 1.22.5 1.22s-.18.76-.22.92c-.06.26-.34.34-.54.24-1.26-.58-1.84-2.12-1.84-3.44 0-2.8 2.04-5.38 6.08-5.38 3.18 0 5.46 2.08 5.46 5.02 0 3.04-1.54 5.18-3.56 5.18-.72 0-1.4-.6-1.2-1.32.2-.68.46-1.42.46-1.9 0-.44-.24-.82-.74-.82-1.16 0-2.1 1.18-2.1 2.76 0 1 .34 1.7.34 1.7s-1.16 4.98-1.38 5.86c-.1.42-.08 1.02-.02 1.4l.1.02c.28-.36 1.38-1.72 1.8-3.3.12-.44.68-2.68.68-2.68.34.66 1.34 1.14 2.4 1.14 3.16 0 5.3-2.84 5.3-6.44C20.92 5.36 17.86 2 12.04 2z" />
              </svg>
            </a>
          </div>
        </div>

        <ContactForm />
      </div>

      <div className="container footnote">
        <p>
          &copy; {new Date().getFullYear()} Vickie&apos;s Atelier &bull; All
          rights reserved
        </p>
      </div>
    </footer>
  );
}
