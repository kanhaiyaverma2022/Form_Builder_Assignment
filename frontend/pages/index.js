import Link from "next/link";
import { FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-8">
          Form Builder
        </h1>
        <Link
          href="/designer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
        >
          <FileText className="w-6 h-6" />
          Start Building Forms
        </Link>
      </div>
    </div>
  );
}