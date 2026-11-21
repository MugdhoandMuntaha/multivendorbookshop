import { PaymentProvider } from "./types";
import { codPaymentProvider } from "./cod-provider";
import { mockPaymentProvider } from "./mock-provider";

export * from "./types";
export * from "./cod-provider";
export * from "./mock-provider";

const providers: Record<string, PaymentProvider> = {
  cod: codPaymentProvider,
  cash_on_delivery: codPaymentProvider,
  mock: mockPaymentProvider,
};

export function getPaymentProvider(id: string): PaymentProvider {
  return providers[id.toLowerCase()] || codPaymentProvider;
}
