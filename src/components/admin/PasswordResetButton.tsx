"use client";

import { useState } from "react";
import { Key, Copy, CheckCircle } from "lucide-react";

export default function PasswordResetButton({ userId, userEmail, hasPassword }: {
    userId: string;
    userEmail: string;
    hasPassword: boolean;
}) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [resetUrl, setResetUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const generateResetLink = async () => {
        setIsGenerating(true);
        setError("");

        try {
            const res = await fetch("/api/admin/generate-reset-link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();

            if (res.ok) {
                setResetUrl(data.resetUrl);
            } else {
                setError(data.error || "Failed to generate link");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(resetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!hasPassword) {
        return (
            <span className="text-xs text-gray-400" title="This user only uses Google sign-in">
                OAuth only
            </span>
        );
    }

    if (resetUrl) {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={resetUrl}
                        readOnly
                        className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 flex-1 font-mono"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-1"
                    >
                        {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <p className="text-xs text-gray-500">Expires in 1 hour</p>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={generateResetLink}
                disabled={isGenerating}
                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            >
                <Key className="w-3 h-3" />
                {isGenerating ? 'Generating...' : 'Reset Password'}
            </button>
            {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
}
