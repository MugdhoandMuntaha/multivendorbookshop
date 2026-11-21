export interface PaymentInitiationParams {
  orderId: string;
  amountMinor: number;
  currency: string;
  buyerEmail?: string;
  buyerPhone: string;
  buyerName: string;
  redirectUrl?: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  paymentReference: string;
  redirectUrl?: string;
  status: "pending" | "paid" | "failed";
  error?: string;
}

export interface PaymentVerificationParams {
  orderId: string;
  paymentReference: string;
  payload?: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: "paid" | "failed";
  transactionId?: string;
  error?: string;
}

export interface PaymentProvider {
  readonly id: string;
  readonly name: string;
  readonly isOffline: boolean;
  initiate(params: PaymentInitiationParams): Promise<PaymentInitiationResult>;
  verify(params: PaymentVerificationParams): Promise<PaymentVerificationResult>;
}
