'use client';

import { useEffect } from 'react';

export function ClearCartOnMount() {
  useEffect(() => {
    localStorage.removeItem('butterfly_cart');
    window.dispatchEvent(new Event('butterfly-cart-updated'));
  }, []);
  return null;
}
