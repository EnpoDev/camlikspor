import { Award, Users, Landmark } from "lucide-react";

interface AboutSectionProps {
  dealerName: string;
  aboutText?: string | null;
  dictionary: {
    badge: string;
    title: string;
    description: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
}

const features = [
  { icon: Award, key: "feature1" as const },
  { icon: Users, key: "feature2" as const },
  { icon: Landmark, key: "feature3" as const },
];

export function AboutSection({
  dealerName,
  aboutText,
  dictionary,
}: AboutSectionProps) {
  return (
    <section id="about" className="py-20 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              {dictionary.badge}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
            {dictionary.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-3xl">
            <span className="font-semibold text-slate-900">{dealerName}</span>{" "}
            {aboutText || dictionary.description}
          </p>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {features.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex-shrink-0 h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {dictionary[`${key}Title`]}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {dictionary[`${key}Desc`]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
