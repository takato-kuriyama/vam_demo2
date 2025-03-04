import { Search } from "lucide-react";
import { Input } from "./input";
import { Label } from "./label";
import { DatePicker } from "./date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface FilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  onDateChange?: (type: "start" | "end", date: Date | undefined) => void;
  selectOptions?: { value: string; label: string }[];
  selectedValue?: string;
  onSelectChange?: (value: string) => void;
  selectPlaceholder?: string;
  children?: React.ReactNode;
}

export function FilterPanel({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "検索...",
  startDate,
  endDate,
  onDateChange,
  selectOptions,
  selectedValue,
  onSelectChange,
  selectPlaceholder = "選択...",
  children,
}: FilterPanelProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {selectOptions && onSelectChange && (
          <div className="w-full md:w-64">
            <Select value={selectedValue} onValueChange={onSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder={selectPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {children}
      </div>

      {onDateChange && (
        <div className="flex flex items-center gap-2">
          <Label>期間：</Label>
          <DatePicker
            date={startDate || undefined}
            onSelect={(date) => onDateChange("start", date)}
            placeholder="開始日"
          />
          <span>～</span>
          <DatePicker
            date={endDate || undefined}
            onSelect={(date) => onDateChange("end", date)}
            placeholder="終了日"
          />
        </div>
      )}
    </div>
  );
}
