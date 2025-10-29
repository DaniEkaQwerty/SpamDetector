"use client";
import { useState } from "react";
import { Loader2, Mail, ShieldCheck, ShieldAlert } from "lucide-react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      setResult("Error connecting to backend");
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center border border-gray-200">
        <div className="flex justify-center mb-4">
          <Mail className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Email Spam Detector
        </h1>
        <textarea
          className="border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all p-4 rounded-xl w-full h-40 text-gray-700 placeholder-gray-400"
          placeholder="Masukkan teks email di sini..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Checking...
            </>
          ) : (
            "Check Spam"
          )}
        </button>


        {result && (
          <div className="mt-8 p-5 rounded-xl bg-gray-50 border">
            {result === "spam" ? (
              <div className="flex flex-col items-center text-red-600">
                <ShieldAlert className="w-10 h-10 mb-2" />
                <p className="text-xl font-bold">Spam Detected!</p>
              </div>
            ) : result === "not spam" ? (
              <div className="flex flex-col items-center text-green-600">
                <ShieldCheck className="w-10 h-10 mb-2" />
                <p className="text-xl font-bold">Safe Email</p>
              </div>
            ) : (
              <p className="text-red-500">Error connecting to backend</p>
            )}
          </div>
        )}


      </div>
    </main>
  );
}
