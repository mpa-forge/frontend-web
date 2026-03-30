import type { ReactNode } from "react";

export type DetailListItem = {
  label: string;
  value: ReactNode;
};

type DetailListProps = {
  items: DetailListItem[];
};

export function DetailList({ items }: DetailListProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.label}>
          {item.label}: {item.value}
        </li>
      ))}
    </ul>
  );
}
