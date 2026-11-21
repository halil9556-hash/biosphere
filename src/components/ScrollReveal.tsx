import React, { useState, useEffect, useRef } from 'react';

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    direction === 'left'
      ? '-translate-x-12 opacity-0'
      : direction === 'right'
      ? 'translate-x-12 opacity-0'
      : 'translate-y-12 opacity-0';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'translate-x-0 translate-y-0 opacity-100' : hiddenTransform
      } ${className}`}
    >
      {children}
    </div>
  );
}