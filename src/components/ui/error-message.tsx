import React from "react";

interface ErrorMessageProps {
  error?: string;
  retry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error = "データの読み込みに失敗しました",
  retry,
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-40 gap-4">
      <p className="text-red-500">{error}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          再読み込み
        </button>
      )}
    </div>
  );
};
