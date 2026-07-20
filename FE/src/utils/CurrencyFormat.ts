export function formatCurrency(digits: string) {
  const clean = digits.replace(/\D/g, "");

  const amount = Number(clean || "0") / 100;

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function NumberCurrency(digits: number, min = 2, max = 2) {

  return digits.toLocaleString(undefined, {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  })

}

export function restoreFormat(digits: string) {

  return Number(
    digits.replace(/,/g, "")
  );

}