import type { QuizQuestion } from "@/types/lesson";
import type { StudentAnswer } from "@/types/quiz";

type QuizPanelProps = {
  questions: QuizQuestion[];
  answers: StudentAnswer[];
  onAnswer: (questionId: string, answer: string) => void;
  onSubmit: () => void;
};

export function QuizPanel({ questions, answers, onAnswer, onSubmit }: QuizPanelProps) {
  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer.answer]));
  const answeredCount = questions.filter((question) => Boolean(answerMap.get(question.id)?.trim())).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200" aria-labelledby="quiz-title">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Quiz Engine</p>
      <h1 id="quiz-title" className="mt-2 text-3xl font-bold text-slate-950">Mastery Check</h1>
      <p className="mt-2 text-slate-600">Answer every question. Multiple-choice questions are auto-scored; open responses receive heuristic MVP scoring and should later route to rubric review.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Questions" value={String(questions.length)} />
        <Metric label="Answered" value={`${answeredCount}/${questions.length}`} />
        <Metric label="Evidence" value={allAnswered ? "Ready" : "Incomplete"} />
      </div>

      <div className="mt-6 space-y-5">
        {questions.map((question, index) => (
          <div key={question.id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">{index + 1}. {question.question}</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">Skill: {question.skillTag} · Difficulty: {question.difficulty}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">{question.type}</span>
            </div>
            {question.choices?.length ? (
              <fieldset className="mt-4 grid gap-2">
                <legend className="sr-only">Choices for question {index + 1}</legend>
                {question.choices.map((choice) => {
                  const selected = answerMap.get(question.id) === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => onAnswer(question.id, choice)}
                      aria-pressed={selected}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${selected ? "border-indigo-500 bg-indigo-50 text-indigo-950" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </fieldset>
            ) : (
              <label className="mt-4 block">
                <span className="text-sm font-medium text-slate-700">Explain your thinking</span>
                <textarea
                  value={answerMap.get(question.id) ?? ""}
                  onChange={(event) => onAnswer(question.id, event.target.value)}
                  className="mt-2 min-h-28 w-full rounded-2xl border border-slate-300 p-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Use claim, evidence, and reasoning. Show your steps."
                />
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">{allAnswered ? "Ready to submit." : "Answer all questions before submitting."}</p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!allAnswered}
          className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit quiz
        </button>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}
