export function getApplicationFeePaise() {
  const value =
    process.env.APPLICATION_FEE_PAISE;

  if (!value) {
    throw new Error(
      "APPLICATION_FEE_PAISE is not defined."
    );
  }

  const amount =
    Number(value);

  if (
    !Number.isInteger(amount) ||
    amount <= 0
  ) {
    throw new Error(
      "APPLICATION_FEE_PAISE must be a positive integer."
    );
  }

  return amount;
}