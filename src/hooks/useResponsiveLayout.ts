import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

const DESKTOP_BREAKPOINT = 768;

function getLayout(width: number) {
  return {
    isDesktop: width >= DESKTOP_BREAKPOINT,
    isMobile: width < DESKTOP_BREAKPOINT,
    width,
  };
}

export function useResponsiveLayout() {
  const [layout, setLayout] = useState(() =>
    getLayout(Dimensions.get('window').width),
  );

  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }) => {
      setLayout(getLayout(window.width));
    };
    const sub = Dimensions.addEventListener('change', handler);
    return () => sub.remove();
  }, []);

  return layout;
}
