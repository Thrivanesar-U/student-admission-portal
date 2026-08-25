import Razorpay from "razorpay";

export function getRazorpayClient() {
  const keyId =
    process.env.RAZORPAY_KEY_ID;

  const keySecret =
    process.env.RAZORPAY_KEY_SECRET;

  if (!keyId) {
    throw new Error(
      "RAZORPAY_KEY_ID is not defined."
    );
  }

  if (!keySecret) {
    throw new Error(
      "RAZORPAY_KEY_SECRET is not defined."
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}