import React from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
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
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {dictionary.title}
          </h2>
          <p className="text-lg text-muted-foreground">{dictionary.subtitle}</p>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {contactItems.map((item, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                  {item.label}
                </h3>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.icon === MapPin || item.icon === MessageCircle ? "_blank" : undefined}
                    rel={item.icon === MapPin || item.icon === MessageCircle ? "noopener noreferrer" : undefined}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-foreground">{item.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Embed — only shown when address is configured */}
        {contactAddress && (
          <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="Konum"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed`}
              className="w-full h-64 md:h-96 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </section>
  );
}
