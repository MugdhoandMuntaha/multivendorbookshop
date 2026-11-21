import {
  PaymentProvider,
  PaymentInitiationParams,
  PaymentInitiationResult,
  PaymentVerificationParams,
  PaymentVerificationResult,
} from "./types";

export class MockDigitalPaymentProvider implements PaymentProvider {
  readonly id = "mock";
  readonly name = "Instant Mock Digital Gateway";
  readonly isOffline = false;

  async initiate(
    params: PaymentInitiationParams
  ): Promise<PaymentInitiationResult> {
    const reference = `MOCK-${Date.now()}-${params.orderId.slice(0, 8).toUpperCase()}`;
    return {
      success: true,
      paymentReference: reference,
      status: "paid", // Instant successful payment for mock/test sandbox
    };
  }

  async verify(
    params: PaymentVerificationParams
  ): Promise<PaymentVerificationResult> {
    return {
      success: true,
      status: "paid",
      transactionId: params.paymentReference,
    };
  }
}

export const mockPaymentProvider = new MockDigitalPaymentProvider();
