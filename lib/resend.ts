interface SendOrderConfirmationInput {
  to: string;
  artworkTitle: string;
  amount: number;
}

export async function sendOrderConfirmation(_: SendOrderConfirmationInput): Promise<void> {
  return Promise.resolve();
}
