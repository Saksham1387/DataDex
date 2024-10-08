import { ProblemStatement } from "../../../components/ProblemStatement";
import { ProblemSubmitBar } from "../../../components/ProblemSubmitBar";
import { getProblem } from "../../db/problem";

export default async function ProblemPage({
  params: { problemId },
}: {
  params: {
    problemId: string;
  };
}) {
  const problem = await getProblem(problemId);
  if (!problem) {
    return <div>Problem not found</div>;
  }
  const solution = problem.solution ?? "";
  return (
    <div className="flex flex-col min-h-screen bg-darkgray">
      <main className="flex-1 py-8 md:py-12 grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="bg-lightgray text-white rounded-lg shadow-md p-6 w-full">
          <div className="prose prose-stone dark:prose-invert">
            <ProblemStatement
              description={problem.description}
              solution={solution}
            />
          </div>
        </div>

        <ProblemSubmitBar problem={problem} />
      </main>
    </div>
  );
}
export const dynamic = "force-dynamic";
