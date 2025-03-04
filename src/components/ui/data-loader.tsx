import React from "react";
import { ErrorMessage } from "./error-message";

interface DataLoaderProps {
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
  retry?: () => void;
  height?: string;
}

export function DataLoader({
  isLoading,
  error,
  children,
  loadingMessage = "データを読み込み中...",
  errorMessage = "データの読み込みに失敗しました",
  retry,
  height = "h-40",
}: DataLoaderProps) {
  if (isLoading) {
    return (
      <div className={`flex justify-center items-center ${height}`}>
        <p className="text-gray-500">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={errorMessage} retry={retry} />;
  }

  return <>{children}</>;
}
