export function calculateBMI(height: number, weight: number) {
  return weight / ((height * height) / 10000);
}
