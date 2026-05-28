"use client";

import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Footer() {
  const homePageContent = useAppStore((s) => s.homePageContent);

  const socialLinks = [
    {
      label: "Instagram",
      href: homePageContent.footerInstagramLink,
      icon: <Instagram className="h-4 w-4" />,
    },
    {
      label: "Facebook",
      href: homePageContent.footerFacebookLink,
      icon: <Facebook className="h-4 w-4" />,
    },
    {
      label: "Twitter",
      href: homePageContent.footerTwitterLink,
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      label: "TikTok",
      href: homePageContent.footerTiktokLink,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.89a8.28 8.28 0 0 0 4.76 1.5V6.94a4.84 4.84 0 0 1-1-.25Z" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: homePageContent.footerYoutubeLink,
      icon: <Youtube className="h-4 w-4" />,
    },
    {
      label: "WhatsApp",
      href: homePageContent.footerWhatsappLink,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347ZM12.05 21.785c-1.855 0-3.612-.504-5.135-1.453l-.367-.218-3.798.996 1.014-3.703-.242-.385A9.723 9.723 0 0 1 2.24 12.05C2.24 6.635 6.635 2.24 12.05 2.24c2.621 0 5.085 1.022 6.94 2.876a9.738 9.738 0 0 1 2.873 6.934c-.003 5.415-4.398 9.81-9.813 9.81v-.075ZM12.05.165C5.495.165.165 5.495.165 12.05c0 2.104.549 4.16 1.595 5.977L.057 24l6.132-1.61a11.84 11.84 0 0 0 5.86 1.555h.005c6.553 0 11.884-5.33 11.886-11.885A11.81 11.81 0 0 0 20.44 3.51 11.81 11.81 0 0 0 12.054.165h-.005Z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="mt-auto border-t bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">{homePageContent.footerBrandName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {homePageContent.footerBrandDescription}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {socialLinks.map((social) => {
                const hasLink = social.href && social.href.trim() !== "";
                const className = "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors";

                if (hasLink) {
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  );
                }

                return (
                  <span
                    key={social.label}
                    className={`${className} opacity-50 cursor-default`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-3">{homePageContent.footerContactHeading}</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{homePageContent.footerAddressLine1}<br />{homePageContent.footerAddressLine2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{homePageContent.footerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>{homePageContent.footerEmail}</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-semibold mb-3">{homePageContent.footerHoursHeading}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p>{homePageContent.footerHoursWeekday}</p>
                  <p>{homePageContent.footerHoursSaturday}</p>
                  <p>{homePageContent.footerHoursSunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">{homePageContent.footerLinksHeading}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink1}</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink2}</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink3}</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink4}</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink5}</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {homePageContent.footerBrandName} Beauty Salon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
