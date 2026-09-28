"use client";

export default function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
