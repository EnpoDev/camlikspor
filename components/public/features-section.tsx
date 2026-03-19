import { Trophy, Users, Calendar, Shield, Target, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturesSectionProps {
  features?: string | null; // JSON array
  dictionary: {
    title: string;
    subtitle: string;
  };
}

// Default features if none provided
const defaultFeatures = [
  {
    icon: "trophy",
    title: "Profesyonel Eğitim",
    description: "UEFA lisanslı antrenörlerimiz ile uluslararası standartlarda futbol eğitimi sunuyoruz.",
  },
  {
    icon: "users",
    title: "Her Yaş Grubuna Uygun",
    description: "4-18 yaş arası tüm çocuklara özel sınıf ve grup eğitimi programları.",
  },
  {
    icon: "shield",
    title: "Güvenli Ortam",
    description: "Sigorta kapsamında, modern ve güvenli tesislerde eğitim imkânı sağlıyoruz.",
  },
];

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  users: Users,
  calendar: Calendar,
  shield: Shield,
  target: Target,
  star: Star,
};

export function FeaturesSection({ features, dictionary }: FeaturesSectionProps) {
  let featureList = defaultFeatures;

  // Parse custom features if provided
  if (features) {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Only use parsed data if items have actual content
        const validItems = parsed.filter(
          (f: { title?: string; description?: string }) => f.title && f.description
        );
        if (validItems.length > 0) {
          featureList = validItems;
        }
      }
    } catch {
      // Use default features if parsing fails
    }
  }

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {dictionary.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {dictionary.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureList.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Star;
            return (
              <Card
                key={index}
                className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent className="h-6 w-6 text-primary group-hover:text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
