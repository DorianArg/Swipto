"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type DropdownItem = {
  key: string;
  label: string;
  icon?: ReactNode;
};

type Props = {
  title: string;
  items?: DropdownItem[];
  open?: boolean;
  onToggle?: () => void;
  onSelect?: (item: DropdownItem) => void;
  renderTrigger?: (open: boolean) => ReactNode;
  className?: string;
  children?: ReactNode;
  closeOnOutside?: boolean;
  closeOnEscape?: boolean;
  closeOnSelect?: boolean;
};

export default function DropdownSection({
  title,
  items,
  open: controlledOpen,
  onToggle,
  onSelect,
  renderTrigger,
  className = "",
  children,
  closeOnOutside = true,
  closeOnEscape = true,
  closeOnSelect = true,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen =
    controlledOpen !== undefined ? onToggle || (() => {}) : setInternalOpen;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!open || !closeOnOutside) return;
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        if (controlledOpen !== undefined) {
          onToggle?.();
        } else {
          setOpen(false);
        }
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (!open || !closeOnEscape) return;
      if (e.key === "Escape") {
        if (controlledOpen !== undefined) {
          onToggle?.();
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeOnOutside, closeOnEscape, controlledOpen, onToggle]);

  const handleSelect = (item: DropdownItem) => {
    onSelect?.(item);
    if (closeOnSelect) {
      if (controlledOpen !== undefined) {
        onToggle?.();
      } else {
        setOpen(false);
      }
    }
  };

  return (
    <div ref={rootRef} className={`w-full ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        className={`group w-full rounded-md text-left ${
          renderTrigger
            ? ""
            : "flex items-center justify-between px-3 py-2 hover:bg-neutral-800/50"
        }`}
        onClick={() => {
          if (controlledOpen !== undefined) {
            onToggle?.();
          } else {
            setOpen((v) => !v);
          }
        }}
      >
        {renderTrigger ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">{renderTrigger(open)}</div>
            <ChevronDown
              className={`ml-3 size-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden
            />
          </div>
        ) : (
          <>
            <span className="text-sm font-medium">{title}</span>
            <ChevronDown
              className={`size-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden
            />
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
            role="region"
            aria-label={title}
          >
            {children ? (
              <div className="pt-2">{children}</div>
            ) : (
              <ul className="mt-1 space-y-1 px-2 pb-2">
                {(items ?? []).map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelect(item)}
                      className="w-full truncate rounded px-2 py-1.5 text-left text-sm hover:bg-neutral-800/60 flex items-center gap-2"
                      title={item.label}
                    >
                      {item.icon && (
                        <span className="shrink-0">{item.icon}</span>
                      )}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
                {(items ?? []).length === 0 && (
                  <li className="px-2 py-1.5 text-xs text-neutral-400">
                    Aucun élément
                  </li>
                )}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
