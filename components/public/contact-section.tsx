import React from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContactSectionProps {
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactAddress?: string | null;
  dictionary: {
    title: string;
    subtitle: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
    hoursLabel: string;
    hours: string;
  };
}

export function ContactSection({
  contactPhone,
  contactEmail,
  contactAddress,
  dictionary,
}: ContactSectionProps) {
  // Build WhatsApp number: strip non-digits and ensure country code
  const rawPhone = contactPhone ?? "";
  const digitsOnly = rawPhone.replace(/\D/g, "");
  const whatsAppNumber = digitsOnly.startsWith("90")
    ? digitsOnly
    : digitsOnly.length > 0
    ? `90${digitsOnly}`
    : "";

  const contactItems = [
    contactPhone && {
      icon: Phone,
      label: dictionary.phoneLabel,
      value: contactPhone,
      href: `tel:${contactPhone}`,
    },
    whatsAppNumber && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: contactPhone!,
      href: `https://wa.me/${whatsAppNumber}`,
    },
    contactEmail && {
      icon: Mail,
      label: dictionary.emailLabel,
      value: contactEmail,
      href: `mailto:${contactEmail}`,
    },
    contactAddress && {
      icon: MapPin,
      label: dictionary.addressLabel,
      value: contactAddress,
      href: `https://maps.google.com/?q=${encodeURIComponent(contactAddress)}`,
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    label: string;
    value: string;
    href?: string;
  }[];

  if (contactItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark */}
      <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            {dictionary.title}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
            Bize Ulasin
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-white/70 animate-fade-in-up">
            {dictionary.subtitle}
          </p>
        </div>
      </div>

      {/* Accent Bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-1" />
      </div>

      {/* Contact Cards */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Iletisim Bilgileri
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Bize Yazin veya Arayin
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl">
          {contactItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target={item.icon === MapPin || item.icon === MessageCircle ? "_blank" : undefined}
              rel={item.icon === MapPin || item.icon === MessageCircle ? "noopener noreferrer" : undefined}
              className="group"
            >
              <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors flex-shrink-0">
                    <item.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                      {item.label}
                    </p>
                    <p className="font-bold text-slate-900 text-sm truncate">
                      {item.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* Working Hours */}
        <div className="mt-8 max-w-5xl">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                  {dictionary.hoursLabel}
                </p>
                <p className="font-bold text-slate-900">{dictionary.hours}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Embed */}
      {contactAddress && (
        <div className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1 w-8 rounded-full bg-primary" />
                <span className="text-primary text-sm font-bold uppercase tracking-widest">
                  Konum
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
                Bizi Ziyaret Edin
              </h2>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Konum"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed`}
                className="w-full h-64 md:h-96 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
