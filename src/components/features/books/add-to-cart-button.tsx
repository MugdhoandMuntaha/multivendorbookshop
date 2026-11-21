"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { CartItem } from "@/lib/cart/types";

interface AddToCartButtonProps {
  item: Omit<CartItem, "qty">;
  label?: string;
  className?: string;
  variant?: "icon" | "full";
}

export function AddToCartButton({
  item,
  label = "Cart",
  className = "neo-button-green flex h-8 shrink-0 items-center gap-1 rounded-xl px-3 text-xs font-bold",
  variant = "full",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (item.stock <= 0) return;
    addItem(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={item.stock <= 0}
      className={className}
      title={item.stock <= 0 ? "Out of stock" : "Add to Cart"}
    >
      {justAdded ? (
        <>
          <Check className="h-3.5 w-3.5 text-white" />
          {variant === "full" && <span>Added</span>}
        </>
      ) : (
        <>
          <ShoppingBag className="h-3.5 w-3.5" />
          {variant === "full" && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
