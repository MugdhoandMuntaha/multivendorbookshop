import {
  PaymentProvider,
  PaymentInitiationParams,
  PaymentInitiationResult,
  PaymentVerificationParams,
  PaymentVerificationResult,
} from "./types";

export class CashOnDeliveryProvider implements PaymentProvider {
  readonly id = "cod";
  readonly name = "Cash on Delivery";
  readonly isOffline = true;

  async initiate(
    params: PaymentInitiationParams
  ): Promise<PaymentInitiationResult> {
    const reference = `COD-${params.orderId.slice(0, 8).toUpperCase()}`;
    return {
      success: true,
      paymentReference: reference,
      status: "pending",
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

export const codPaymentProvider = new CashOnDeliveryProvider();
