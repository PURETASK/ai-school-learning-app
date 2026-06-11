"use client";

import { useMemo, useState } from "react";
import type { MemoryVaultReviewAnswer, MemoryVaultSessionSummary, ScheduledReviewItem } from "@/types/memoryVault";
import {
  applyMemoryVaultReviewSession,
  buildMemoryVaultSessionId,
  gradeMemoryVaultAnswer,
} from "@/features/memory-vault/memoryVaultEngine";

type MemoryVaultReviewSessionProps = {
  studentId: string;
  items: ScheduledReviewItem[];
  allItems: ScheduledReviewItem[];
  onComplete: (updatedItems: ScheduledReviewItem[], summary: MemoryVaultSessionSummary) => void;
  onExit: () => void;
};

export function MemoryVaultReviewSession({ studentId, items, allItems, onComplete, onExit }: MemoryVaultReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersByItemId, setAnswersByItemId] = useState<Record<string, MemoryVaultReviewAnswer>>({});
  const [draftAnswer, setDraftAnswer] = useState("");
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [revealedItemIds, setRevealedItemIds] = useState<string[]>([]);
  const [summary, setSummary] = useState<MemoryVaultSessionSummary | null>(null);

  const sessionId = useMemo(() => buildMemoryVaultSessionId(studentId), [studentId]);
  const currentItem = items[currentIndex];
  const currentAnswer = currentItem ? answersByItemId[currentItem.id] : undefined;
  const previewOutcome = currentItem && currentAnswer ? gradeMemoryVaultAnswer(currentItem, currentAnswer) : undefined;
  const answeredCount = Object.keys(answersByItemId).length;
  const isCurrentRevealed = currentItem ? revealedItemIds.includes(currentItem.id) : false;

  function submitCurrentAnswer() {
    if (!currentItem || !draftAnswer.trim()) return;
    const answer: MemoryVaultReviewAnswer = {
      itemId: currentItem.id,
      answer: draftAnswer.trim(),
      confidence,
      answeredAtIso: new Date().toISOString(),
    };
    setAnswersByItemId((current) => ({ ...current, [currentItem.id]: answer }));
    setRevealedItemIds((current) => current.includes(currentItem.id) ? current : [...current, currentItem.id]);
  }

  function moveToIndex(nextIndex: number) {
    const bounded = Math.max(0, Math.min(items.length - 1, nextIndex));
    setCurrentIndex(bounded);
    const nextItem = items[bounded];
    setDraftAnswer(nextItem ? answersByItemId[nextItem.id]?.answer ?? "" : "");
    setConfidence((nextItem ? answersByItemId[nextItem.id]?.confidence : undefined) ?? 3);
  }

  function completeSession() {
    const answers = Object.values(answersByItemId);
    const result = applyMemoryVaultReviewSession({ items, answers, allItems, sessionId });
    setSummary(result.summary);
    onComplete(result.updatedItems, result.summary);
  }

  if (!items.length) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200" aria-labelledby="memory-vault-empty-title">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Memory Vault</p>
        <h1 id="memory-vault-empty-title" className="mt-2 text-3xl font-bold text-slate-950">No review items yet</h1>
        <p className="mt-3 text-slate-600">Complete a lesson to schedule Day 1, 3, 7, 14, and 30 review prompts.</p>
        <button type="button" onClick={onExit} className="mt-6 rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Back to dashboard
        </button>
      </section>
    );
  }

  if (summary) {
    return (
      <section className="space-y-6" aria-labelledby="memory-vault-summary-title">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Memory Vault Complete</p>
          <h1 id="memory-vault-summary-title" className="mt-2 text-3xl font-bold text-slate-950">Review session summary</h1>
          <div className="mt-5 grid gap-4 md:grid-cols-5">
            <Metric label="Items" value={String(summary.totalItems)} />
            <Metric label="Correct" value={`${summary.correctCount}/${summary.totalItems}`} />
            <Metric label="Average" value={`${summary.averageScore}%`} />
            <Metric label="Mastered" value={String(summary.masteredCount)} />
            <Metric label="Reteach" value={String(summary.reteachCount)} />
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-950">Outcome details</h2>
          <ul className="mt-4 space-y-3">
            {summary.outcomes.map((outcome) => (
              <li key={outcome.itemId} className={`rounded-2xl p-4 text-sm ring-1 ${outcome.isCorrect ? "bg-emerald-50 ring-emerald-200" : "bg-amber-50 ring-amber-200"}`}>
                <p className="font-semibold text-slate-950">{outcome.score}% · {outcome.nextRetentionStrength}</p>
                <p className="mt-1 text-slate-700">{outcome.feedback}</p>
                <p className="mt-1 text-slate-700">Action: {outcome.action}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onExit} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Return to dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="memory-vault-title">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Memory Vault Review Session</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 id="memory-vault-title" className="text-3xl font-bold text-slate-950">Retrieve it from memory</h1>
            <p className="mt-2 text-slate-600">Item {currentIndex + 1} of {items.length} · {answeredCount}/{items.length} answered</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100 md:w-72" aria-label={`${Math.round((answeredCount / items.length) * 100)} percent complete`}>
            <div className="h-3 rounded-full bg-indigo-600" style={{ width: `${Math.round((answeredCount / items.length) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>{currentItem.subject}</span>
            <span>·</span>
            <span>{currentItem.reviewStage.replace("-", " ")}</span>
            <span>·</span>
            <span>{currentItem.retentionStrength}</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-950">{currentItem.prompt}</h2>
          <label htmlFor="memory-vault-answer" className="mt-6 block text-sm font-semibold text-slate-700">Type what you remember before revealing the answer.</label>
          <textarea
            id="memory-vault-answer"
            value={draftAnswer}
            onChange={(event) => setDraftAnswer(event.target.value)}
            rows={5}
            className="mt-2 w-full rounded-2xl border border-slate-300 p-4 text-sm text-slate-950 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Explain the idea in your own words..."
          />
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-slate-700">Confidence</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setConfidence(value as 1 | 2 | 3 | 4 | 5)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ring-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${confidence === value ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-700 ring-slate-300"}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => moveToIndex(currentIndex - 1)} disabled={currentIndex === 0} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Previous
            </button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={submitCurrentAnswer} disabled={!draftAnswer.trim()} className="rounded-2xl border border-indigo-300 px-5 py-3 text-sm font-semibold text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Check answer
              </button>
              {currentIndex < items.length - 1 ? (
                <button type="button" onClick={() => moveToIndex(currentIndex + 1)} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Next item
                </button>
              ) : (
                <button type="button" onClick={completeSession} disabled={answeredCount < items.length} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Finish session
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-950">Feedback</h2>
            {isCurrentRevealed && previewOutcome ? (
              <div className={`mt-4 rounded-2xl p-4 text-sm ring-1 ${previewOutcome.isCorrect ? "bg-emerald-50 ring-emerald-200" : "bg-amber-50 ring-amber-200"}`}>
                <p className="font-semibold text-slate-950">{previewOutcome.score}% · {previewOutcome.isCorrect ? "Recalled" : "Needs review"}</p>
                <p className="mt-2 text-slate-700">Expected: {currentItem.expectedAnswer}</p>
                <p className="mt-2 text-slate-700">{previewOutcome.feedback}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-600">Answer first. The app will reveal the expected answer, score the response, and decide whether to complete or reschedule this item.</p>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-950">Review Queue</h2>
            <ol className="mt-4 space-y-2">
              {items.map((item, index) => {
                const isAnswered = Boolean(answersByItemId[item.id]);
                const isActive = index === currentIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => moveToIndex(index)}
                      className={`w-full rounded-2xl p-3 text-left text-sm ring-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isActive ? "bg-indigo-50 ring-indigo-300" : "bg-slate-50 ring-slate-200"}`}
                    >
                      <span className="font-semibold text-slate-950">{index + 1}. {item.skillTag}</span>
                      <span className="ml-2 text-slate-500">{isAnswered ? "answered" : "pending"}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}
