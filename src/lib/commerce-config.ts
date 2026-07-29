export const MOBILE_BANKING_NUMBER =
  process.env.NEXT_PUBLIC_MOBILE_BANKING_NUMBER?.trim() || '+8801816339639';

export const INSIDE_DHAKA_DELIVERY_FEE = 60;
export const OUTSIDE_DHAKA_DELIVERY_FEE = 120;

export const MOBILE_BANKING_PROVIDERS = [
  { value: 'BKASH', label: 'bKash', logo: '/images/payments/bkash.svg' },
  { value: 'NAGAD', label: 'Nagad', logo: '/images/payments/nagad.svg' },
  { value: 'ROCKET', label: 'Rocket', logo: '/images/payments/rocket.svg' },
] as const;

export type MobileBankingProviderValue = (typeof MOBILE_BANKING_PROVIDERS)[number]['value'];
export type DeliveryZoneValue = 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA';

export function deliveryFeeForZone(zone: DeliveryZoneValue) {
  return zone === 'INSIDE_DHAKA' ? INSIDE_DHAKA_DELIVERY_FEE : OUTSIDE_DHAKA_DELIVERY_FEE;
}

export function paymentProviderLabel(provider?: string | null) {
  return MOBILE_BANKING_PROVIDERS.find((item) => item.value === provider)?.label || 'Mobile Banking';
}
