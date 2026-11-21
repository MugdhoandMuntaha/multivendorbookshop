/**
 * Notification dispatch service stub for RTDS Bookshop Platform.
 * Simulates transactional SMS (via providers like BulkSMS BD, Greenweb, SSL Wireless)
 * and transactional email (via Resend, SendGrid) for order placement and fulfillment.
 */

export interface OrderConfirmationParams {
  orderId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string | null;
  totalMinor: number;
  paymentMethod: string;
}

export interface FulfillmentDispatchParams {
  orderId: string;
  orderItemId: string;
  buyerName: string;
  buyerPhone: string;
  courier: string;
  trackingNumber: string;
  trackingUrl?: string;
  bookTitle: string;
  vendorName: string;
}

/**
 * Dispatches order placement SMS and Email to the buyer upon checkout confirmation.
 */
export async function sendOrderConfirmationNotification(
  params: OrderConfirmationParams
): Promise<{ success: boolean; simulatedId: string }> {
  const shortId = params.orderId.slice(0, 8).toUpperCase();
  const formattedAmount = (params.totalMinor / 100).toFixed(0);

  // Transactional SMS template dedicated to Bangladeshi logistics
  const smsBody = `[RTDS Platform] Order #${shortId} confirmed! Total: ৳${formattedAmount} (${params.paymentMethod.toUpperCase()}). We are packaging your books for rapid courier delivery. Helpline: 01700-000000.`;

  console.log(`\n========================================`);
  console.log(`📩 [RTDS SMS STUB] To: ${params.buyerPhone} (${params.buyerName})`);
  console.log(`Content: "${smsBody}"`);
  if (params.buyerEmail) {
    console.log(`📧 [RTDS EMAIL STUB] To: ${params.buyerEmail}`);
    console.log(`Subject: Your RTDS Bookshop Order #${shortId} has been confirmed!`);
  }
  console.log(`========================================\n`);

  return {
    success: true,
    simulatedId: `NOTIF-CONFIRM-${shortId}-${Date.now()}`,
  };
}

/**
 * Dispatches courier consignment tracking SMS to the buyer when a vendor ships a package.
 */
export async function sendFulfillmentDispatchNotification(
  params: FulfillmentDispatchParams
): Promise<{ success: boolean; simulatedId: string }> {
  const shortId = params.orderId.slice(0, 8).toUpperCase();

  const smsBody = `[RTDS Platform] Good news ${params.buyerName}! Your book "${params.bookTitle}" from ${params.vendorName} has been dispatched via ${params.courier}. Tracking ID: ${params.trackingNumber}.${params.trackingUrl ? ` Track parcel: ${params.trackingUrl}` : ""}`;

  console.log(`\n========================================`);
  console.log(`🚚 [RTDS COURIER DISPATCH STUB] To: ${params.buyerPhone} (${params.buyerName})`);
  console.log(`Content: "${smsBody}"`);
  console.log(`Associated Order Item: ${params.orderItemId} (Order #${shortId})`);
  console.log(`========================================\n`);

  return {
    success: true,
    simulatedId: `NOTIF-DISPATCH-${shortId}-${Date.now()}`,
  };
}
