export function formatCurrency(digits: string) {
  const clean = digits.replace(/\D/g, "");

  const amount = Number(clean || "0") / 100;

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function restoreFormat(digits: string) {

  return Number(
    digits.replace(/,/g, "")
  );

}