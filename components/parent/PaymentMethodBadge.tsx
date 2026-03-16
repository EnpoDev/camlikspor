import { Badge } from "@/components/ui/badge";
import { Banknote, CreditCard, Building2, Smartphone } from "lucide-react";

const methodConfig = {
  CASH: { label: "Nakit", icon: Banknote },
  CREDIT_CARD: { label: "Kredi Kartı", icon: CreditCard },
  BANK_TRANSFER: { label: "Havale", icon: Building2 },
  ONLINE_PAYTR: { label: "Online", icon: Smartphone },
};

export function PaymentMethodBadge({ method }: { method: keyof typeof methodConfig }) {
  const config = methodConfig[method] || methodConfig.CASH;
  const Icon = config.icon;

  return (
    <Badge variant="outline">
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
}
