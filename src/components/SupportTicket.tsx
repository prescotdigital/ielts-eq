"use client";

import { useState } from "react";
import { MessageSquare, Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitSupportTicket } from "@/app/actions/support";

export default function SupportTicket() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const formData = new FormData();
            formData.append("subject", subject);
            formData.append("message", message);
            files.forEach((file) => {
                formData.append("files", file);
            });

            await submitSupportTicket(formData);

            setSubmitStatus("success");
            setMessage("");
            setSubject("");
            setFiles([]);

            setTimeout(() => {
                setIsOpen(false);
                setSubmitStatus("idle");
            }, 2000);
        } catch (error) {
            console.error("Failed to submit support ticket", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Need Help?</p>
                        <p className="text-lg font-bold text-gray-900">Contact Support</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Contact Support</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief description of your issue"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your question, comment, or suggestion..."
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>

                {files.length > 0 && (
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                <span className="text-sm text-gray-600 truncate flex-1">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Paperclip className="w-4 h-4" />
                        Attach files or screenshots
                        <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {submitStatus === "success" && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                        Message sent successfully! We'll get back to you soon.
                    </div>
                )}

                {submitStatus === "error" && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        Failed to send message. Please try again.
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    {isSubmitting ? (
                        <>Sending...</>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
