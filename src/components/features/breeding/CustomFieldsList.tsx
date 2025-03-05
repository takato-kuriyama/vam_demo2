import React from "react";
import { Plus, X } from "lucide-react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { CustomField } from "../../../types/dataManagement";

interface CustomFieldsListProps {
  customFields: CustomField[];
  onAddClick: () => void;
  onRemoveField: (id: string) => void;
  onChangeField: (id: string, value: string) => void;
}

const CustomFieldsList: React.FC<CustomFieldsListProps> = ({
  customFields,
  onAddClick,
  onRemoveField,
  onChangeField,
}) => {
  if (customFields.length === 0) {
    return (
      <div className="flex justify-center mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onAddClick}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          カスタム項目追加
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">カスタム項目</h3>
      {customFields.map((field) => (
        <div key={field.id} className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <Label htmlFor={field.id}>{field.name}</Label>
            <button
              type="button"
              onClick={() => onRemoveField(field.id)}
              className="hover:bg-gray-200 rounded-full p-1"
              title="削除"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Input
            id={field.id}
            value={field.value}
            onChange={(e) => onChangeField(field.id, e.target.value)}
          />
        </div>
      ))}

      <div className="flex justify-center mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onAddClick}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          カスタム項目追加
        </Button>
      </div>
    </div>
  );
};

export default CustomFieldsList;
