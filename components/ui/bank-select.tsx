"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Bank list from bankalar.json
const banks = [
  { name: "Adabank A.Ş.", eft: "0100", swift: "ADABTRIS" },
  { name: "Akbank T.A.Ş.", eft: "0046", swift: "AKBKTRIS" },
  { name: "Aktif Yatırım Bankası A.Ş.", eft: "0143", swift: "CAYTTRIS" },
  { name: "Alternatifbank A.Ş.", eft: "0124", swift: "ALFBTRIS" },
  { name: "Anadolubank A.Ş.", eft: "0135", swift: "ANDLTRIS" },
  { name: "Arap Türk Bankası A.Ş.", eft: "0091", swift: "ATUBTRIS" },
  { name: "Bank Mellat", eft: "0094", swift: "BKMTTRIS" },
  { name: "Bank of Tokyo-Mitsubishi UFJ Turkey A.Ş.", eft: "0147", swift: "BOTKTRIS" },
  { name: "BankPozitif Kredi ve Kalkınma Bankası A.Ş.", eft: "0142", swift: "BPTRTRIS" },
  { name: "Birleşik Fon Bankası A.Ş.", eft: "0029", swift: "BAYDTRIS" },
  { name: "Burgan Bank A.Ş.", eft: "0125", swift: "TEKFTRIS" },
  { name: "Citibank A.Ş.", eft: "0092", swift: "CITITRIX" },
  { name: "Denizbank A.Ş.", eft: "0134", swift: "DENITRIS" },
  { name: "Deutsche Bank A.Ş.", eft: "0115", swift: "BKTRTRIS" },
  { name: "Diler Yatırım Bankası A.Ş.", eft: "0138", swift: "DYAKTRIS" },
  { name: "Fibabanka A.Ş.", eft: "0103", swift: "FBHLTRIS" },
  { name: "Finans Bank A.Ş.", eft: "0111", swift: "FNNBTRIS" },
  { name: "GSD Yatırım Bankası A.Ş.", eft: "0139", swift: "GSDBTRIS" },
  { name: "Habib Bank Limited", eft: "0097", swift: "HABBTRIS" },
  { name: "HSBC Bank A.Ş.", eft: "0123", swift: "HSBCTRIX" },
  { name: "ING Bank A.Ş.", eft: "0099", swift: "INGBTRIS" },
  { name: "Intesa Sanpaolo S.p.A.", eft: "0148", swift: "BCITTRIS" },
  { name: "İller Bankası A.Ş.", eft: "0004", swift: "" },
  { name: "İstanbul Takas ve Saklama Bankası A.Ş.", eft: "0132", swift: "TVSBTRIS" },
  { name: "JPMorgan Chase Bank N.A.", eft: "0098", swift: "CHASTRIS" },
  { name: "Merrill Lynch Yatırım Bank A.Ş.", eft: "0129", swift: "MEYYTRISXXX" },
  { name: "Nurol Yatırım Bankası A.Ş.", eft: "0141", swift: "NUROTRIS" },
  { name: "Odea Bank A.Ş.", eft: "0146", swift: "ODEATRIS" },
  { name: "Pasha Yatırım Bankası A.Ş.", eft: "0116", swift: "TAIBTRIS" },
  { name: "Rabobank A.Ş.", eft: "0137", swift: "RABOTRIS" },
  { name: "Société Générale (SA)", eft: "0122", swift: "SOGETRIS" },
  { name: "Standard Chartered Yatırım Bankası Türk A.Ş.", eft: "0121", swift: "BSUITRIS" },
  { name: "Şekerbank T.A.Ş.", eft: "0059", swift: "SEKETR2A" },
  { name: "Tekstil Bankası A.Ş.", eft: "0109", swift: "TEKBTRIS" },
  { name: "The Royal Bank of Scotland Plc.", eft: "0088", swift: "ABNATRIS" },
  { name: "Turkish Bank A.Ş.", eft: "0096", swift: "TUBATRIS" },
  { name: "Turkland Bank A.Ş.", eft: "0108", swift: "TBNKTRIS" },
  { name: "Türk Ekonomi Bankası A.Ş.", eft: "0032", swift: "TEBUTRIS" },
  { name: "Türk Eximbank", eft: "0016", swift: "TIKBTR2A" },
  { name: "Türkiye Cumhuriyeti Ziraat Bankası A.Ş.", eft: "0010", swift: "TCZBTR2A" },
  { name: "Türkiye Garanti Bankası A.Ş.", eft: "0062", swift: "TGBATRIS" },
  { name: "Türkiye Halk Bankası A.Ş.", eft: "0012", swift: "TRHBTR2A" },
  { name: "Türkiye İş Bankası A.Ş.", eft: "0064", swift: "ISBKTRIS" },
  { name: "Türkiye Kalkınma Bankası A.Ş.", eft: "0017", swift: "TKBNTR2A" },
  { name: "Türkiye Sınai Kalkınma Bankası A.Ş.", eft: "0014", swift: "TSKBTRIS" },
  { name: "Türkiye Vakıflar Bankası T.A.O.", eft: "0015", swift: "TVBATR2A" },
  { name: "Yapı ve Kredi Bankası A.Ş.", eft: "0067", swift: "YAPITRISFEX" },
];

interface BankSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  defaultValue?: string;
}

export function BankSelect({ value: controlledValue, onChange, name, id, defaultValue }: BankSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");

  const currentValue = controlledValue !== undefined ? controlledValue : value;

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === currentValue ? "" : selectedValue;
    setValue(newValue);
    onChange?.(newValue);
    setOpen(false);
  };

  const selectedBank = banks.find((bank) => bank.name === currentValue);

  return (
    <>
      <input type="hidden" name={name} id={id} value={currentValue} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {selectedBank ? (
              <span className="truncate">{selectedBank.name}</span>
            ) : (
              <span className="text-muted-foreground">Banka seçin...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Banka ara..." />
            <CommandList>
              <CommandEmpty>Banka bulunamadı.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {banks.map((bank) => (
                  <CommandItem
                    key={bank.eft}
                    value={bank.name}
                    onSelect={() => handleSelect(bank.name)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentValue === bank.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{bank.name}</span>
                      <span className="text-xs text-muted-foreground">
                        EFT: {bank.eft}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

export { banks };
