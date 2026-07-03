"use client";

import { useState } from "react";

interface LoginFormProps {
  onSuccess: () => void;
  isFirstRun: boolean;
}

export function LoginForm({ onSuccess, isFirstRun }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrMsg("");

    if (isFirstRun) {
      if (password !== confirmPassword) {
        setError(true);
        setErrMsg("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setError(true);
        setErrMsg("Password must be at least 8 characters.");
        setLoading(false);
        return;
      }
    }

    const endpoint = isFirstRun ? "/api/auth/setup" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      onSuccess();
    } catch (err: unknown) {
      setError(true);
      if (err instanceof Error) {
        setErrMsg(err.message);
      } else {
        setErrMsg("Network or server failure.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto card p-8 bg-panel border-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue to-violet" />
      <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl mb-6 text-text-primary">
        {isFirstRun ? "Initialize Admin Account" : "Access Admin Panel"}
      </h2>
      <p className="text-sm text-text-secondary mb-8">
        {isFirstRun
          ? "Create a master password for your portfolio CMS. Obscurity is not security; this panel is fully protected server-side."
          : "Obscurity is not security. Please enter the master password to manage your portfolio content."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">
            PASSWORD
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full neu-input"
            placeholder="••••••••"
          />
        </div>

        {isFirstRun && (
          <div>
            <label className="block text-xs font-[family-name:var(--font-mono)] text-text-muted mb-2">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full neu-input"
              placeholder="••••••••"
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-[family-name:var(--font-mono)]">
            Error: {errMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 btn-primary justify-center font-bold text-sm tracking-wide"
        >
          {loading ? "Processing..." : isFirstRun ? "Create Account" : "Authenticate"}
        </button>
      </form>
    </div>
  );
}
