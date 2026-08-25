"use client";

import { Printer } from "lucide-react";

export default function PrintApplicationButton() {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 print:hidden"
    >
      <Printer className="h-5 w-5" />

      Print Application
    </button>
  );
}