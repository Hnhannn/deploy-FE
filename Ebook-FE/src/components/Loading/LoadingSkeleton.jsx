
function LoadingSkeleton({ className }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 mb-4 max-w-sm animate-pulse ${className}`}
    ></div>
  );
}

export default LoadingSkeleton