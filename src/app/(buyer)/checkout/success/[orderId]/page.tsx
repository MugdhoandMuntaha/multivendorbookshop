import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getOrderById } from "@/server/queries/orders";
import { OrderSuccessView } from "@/components/features/checkout/order-success-view";

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export const metadata: Metadata = {
  title: "Order Confirmed | RTDS Bookshop",
  description: "Your book order has been confirmed successfully on RTDS Bookshop.",
};

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <OrderSuccessView order={order} />
    </div>
  );
}
