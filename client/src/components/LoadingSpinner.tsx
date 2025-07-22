import { LoaderCircle } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="h-full flex justify-center items-center">
      <LoaderCircle className="animate-spin size-10 text-blue-800" />
    </div>
  );
}

export default LoadingSpinner;
