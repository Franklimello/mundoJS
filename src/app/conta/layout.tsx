import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LayoutConta({ children }: { children: ReactNode }) {
  return children;
}
