// src/components/Spinner.tsx
const Spinner = ({ size = '10' }: { size?: string }) => {
  // We map the string keys to full Tailwind classes
  // so Tailwind can "see" them and include them in the CSS.
  const sizeMap: Record<string, string> = {
    '4': 'w-4 h-4 border-2',
    '6': 'w-6 h-6 border-2',
    '8': 'w-8 h-8 border-[3px]',
    '10': 'w-10 h-10 border-4',
    '12': 'w-12 h-12 border-4',
    '16': 'w-16 h-16 border-[6px]',
  };

  const selectedSize = sizeMap[size] || sizeMap['10'];

  return (
    <div
      className={`${selectedSize} border-purple-100 border-t-purple-600 rounded-full animate-spin`}
    ></div>
  );
};

export default Spinner;
