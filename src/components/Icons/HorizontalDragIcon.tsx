function HorizontalDragIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
    >
      <line x1="0" y1="40" x2="64" y2="40" />
      <line x1="0" y1="32" x2="64" y2="32" />
      <line x1="0" y1="24" x2="64" y2="24" />
    </svg>
  );
}

export default HorizontalDragIcon;
