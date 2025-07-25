'use client';

import React from 'react';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Import Bootstrap Icons CSS on the client side
    require('bootstrap-icons/font/bootstrap-icons.css');

    // Import Bootstrap JS on the client side (if needed)
    // require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return <>{children}</>;
}
