"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export function BuildVote({
  buildId,
  initialScore,
  initialUserVote,
}: {
  buildId: string;
  initialScore: number;
  initialUserVote: 1 | -1 | null;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState(initialUserVote);

  const utils = api.useUtils();
  const voteMutation = api.build.vote.useMutation({
    onMutate: async ({ value }) => {
      const prevScore = score;
      const prevVote = userVote;

      // Optimistic update
      let delta = value;
      if (userVote) delta -= userVote;
      setScore((s) => s + delta);
      setUserVote(value === 0 ? null : (value as 1 | -1));

      return { prevScore, prevVote };
    },
    onError: (_err, _vars, context) => {
      if (context) {
        setScore(context.prevScore);
        setUserVote(context.prevVote);
      }
    },
    onSettled: () => {
      void utils.build.getByWeaponSlug.invalidate();
    },
  });

  function handleVote(direction: 1 | -1) {
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }
    const newValue = userVote === direction ? 0 : direction;
    voteMutation.mutate({ buildId, value: newValue });
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={() => handleVote(1)}
        className={`cursor-pointer p-1 transition-colors ${
          userVote === 1
            ? "text-accent2"
            : "text-dim hover:text-foreground"
        }`}
        aria-label="Upvote"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l-8 8h5v8h6v-8h5z" />
        </svg>
      </button>
      <span className="font-mono text-xs text-foreground">{score}</span>
      <button
        onClick={() => handleVote(-1)}
        className={`cursor-pointer p-1 transition-colors ${
          userVote === -1
            ? "text-danger"
            : "text-dim hover:text-foreground"
        }`}
        aria-label="Downvote"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l8-8h-5V4H9v8H4z" />
        </svg>
      </button>
    </div>
  );
}
