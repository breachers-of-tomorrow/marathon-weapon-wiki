"use client";

import { useState, useRef } from "react";
import { useUploadThing } from "@/utils/uploadthing";
import { api } from "@/trpc/react";

const MAX_MESSAGE_LENGTH = 180;

export function SubmitDataButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("submissionImage", {
    onUploadError: (error) => {
      setErrorMsg(error.message);
      setStatus("error");
    },
  });

  const createSubmission = api.submission.create.useMutation({
    onSuccess: () => {
      setStatus("success");
      setTimeout(() => {
        resetAndClose();
      }, 2000);
    },
    onError: (error) => {
      setErrorMsg(error.message);
      setStatus("error");
    },
  });

  function resetAndClose() {
    setMessage("");
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setErrorMsg("");
    setOpen(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(selected);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !message.trim()) return;

    setStatus("uploading");
    setErrorMsg("");

    const uploadResult = await startUpload([file]);
    if (!uploadResult?.[0]) {
      setStatus("error");
      setErrorMsg("Image upload failed. Please try again.");
      return;
    }

    setStatus("submitting");
    createSubmission.mutate({
      message: message.trim(),
      imageUrl: uploadResult[0].ufsUrl,
      pageUrl: window.location.pathname,
    });
  }

  const isSubmitting = status === "uploading" || status === "submitting";
  const canSubmit = message.trim().length > 0 && file !== null && !isSubmitting;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 cryo-panel rounded-lg border-border-accent px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-panel-hover hover:shadow-[0_0_12px_rgba(3,138,223,0.3)] cursor-pointer"
      >
        Provide More Data
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) resetAndClose();
          }}
        >
          <div className="cryo-panel w-full max-w-md rounded-lg border-border-accent p-6 mx-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Submit Data
            </h2>

            {status === "success" ? (
              <p className="text-green-400 text-sm">
                Submission received. Thank you!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-dim mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))
                    }
                    placeholder="Describe the missing or incorrect data..."
                    rows={3}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-dim focus:border-accent focus:outline-none resize-none"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-dim mt-1 text-right">
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-dim mb-1">
                    Verification Screenshot
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-md border border-dashed border-border bg-background px-3 py-3 text-sm text-dim hover:border-accent hover:text-foreground transition-colors cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {file ? file.name : "Click to select image"}
                  </button>
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 max-h-32 rounded-md border border-border object-contain"
                    />
                  )}
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm">{errorMsg}</p>
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="rounded-md px-4 py-2 text-sm text-dim hover:text-foreground transition-colors cursor-pointer"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40 cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
