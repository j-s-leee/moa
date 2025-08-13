import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function FormInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-3">
      <Label htmlFor={props.id}>{label}</Label>
      <Input {...props} />
    </div>
  );
}
