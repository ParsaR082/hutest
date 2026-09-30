/** قیمت‌های mock — مبالغ به تومان (گرد شده) */
export function formatToman(amount: number): string {
  return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
}
