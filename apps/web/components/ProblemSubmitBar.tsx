"use client";
import Editor from "@monaco-editor/react";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/select";
import { useEffect, useState } from "react";
import { LANGUAGE_MAPPING } from "@repo/common/language";
import axios from "axios";
import { CheckIcon, CircleX, ClockIcon } from "lucide-react";
import { toast } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { submissions as SubmissionsType } from "@prisma/client";
import { ISubmission } from "../app/types/types";
import { SubmissionTable } from "./SubmissionTable";

enum SubmitStatus {
  SUBMIT = "SUBMIT",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  FAILED = "FAILED",
}

export interface IProblem {
  id: string;
  title: string;
  description: string;
  slug: string;
  defaultCode: {
    languageId: number;
    code: string;
  }[];
}

export const ProblemSubmitBar = ({
  problem,
  contestId,
}: {
  problem: IProblem;
  contestId?: string;
}) => {
  const [activeTab, setActiveTab] = useState("problem");

  return (
    <div className="bg-lightgray rounded-lg shadow-md p-6 text-white">
      <div className="grid gap-4 bg-">
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full "> 
            <Tabs
              defaultValue="problem"
              className="rounded-md p-1 text-lg bg-darkgray"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-2 w-full bg-darkgray">
                <TabsTrigger value="problem" className="">
                  Submit
                </TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>




         
        </div>
        <div className={`${activeTab === "problem" ? "" : "hidden"}`}>
          <SubmitProblem problem={problem} contestId={contestId} />
        </div>
        {activeTab === "submissions" && <Submissions problem={problem} />}
      </div>
    </div>
  );
};

function Submissions({ problem }: { problem: IProblem }) {
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `/api/submission/bulk?problemId=${problem.id}`
      );
      setSubmissions(response.data.submissions || []);
    };
    fetchData();
  }, [problem.id]);
  return (
    <div>
      <SubmissionTable submissions={submissions} />
    </div>
  );
}

function SubmitProblem({
  problem,
  contestId,
}: {
  problem: IProblem;
  contestId?: string;
}) {
  const [language, setLanguage] = useState(
    Object.keys(LANGUAGE_MAPPING)[0] as string
  );
  const [code, setCode] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>(SubmitStatus.SUBMIT);
  const [testcases, setTestcases] = useState<any[]>([]);
  const session = useSession();

  useEffect(() => {
    const defaultCode: { [key: string]: string } = {};
    problem.defaultCode.forEach((code) => {
      const language = Object.keys(LANGUAGE_MAPPING).find(
        (language) => LANGUAGE_MAPPING[language]?.internal === code.languageId
      );
      if (!language) return;
      defaultCode[language] = code.code;
    });
    setCode(defaultCode);
  }, [problem]);

  async function pollWithBackoff(id: string, retries: number) {
    if (retries === 0) {
      setStatus(SubmitStatus.SUBMIT);
      toast.error("Not able to get status ");
      return;
    }
    const response = await axios.get(`/api/submission/?id=${id}`);
    console.log(response.data);
    if (response.data.submission.status === "PENDING") {
      setTestcases(response.data.submission.testcases);
      await new Promise((resolve) => setTimeout(resolve, 2.5 * 1000));
      pollWithBackoff(id, retries - 1);
    } else {
      if (response.data.submission.status === "AC") {
        setStatus(SubmitStatus.ACCEPTED);
        setTestcases(response.data.submission.testcases);
        toast.success("Accepted!");
        return;
      } else {
        setStatus(SubmitStatus.FAILED);
        toast.error("Failed :(");
        setTestcases(response.data.submission.testcases);
        return;
      }
    }
  }

  async function submit() {
    setStatus(SubmitStatus.PENDING);
    setTestcases((t) => t.map((tc) => ({ ...tc, status: "PENDING" })));
    try {
      const response = await axios.post(`/api/submission/`, {
        code: code[language],
        languageId: language,
        problemId: problem.id,
        activeContestId: contestId,
      });
      pollWithBackoff(response.data.id, 10);
    } catch (e) {
      console.log(e);
      //@ts-ignore
      toast.error(e.response.statusText);
      setStatus(SubmitStatus.SUBMIT);
    }
  }

  return (
    <div>
  <Label htmlFor="language" className="mb-5">
    Language
  </Label>
  <Select
    value={language}
    defaultValue="cpp"
    onValueChange={(value) => setLanguage(value)}
  >
    <SelectTrigger className="bg-lightgray border-darkgray">
      <SelectValue placeholder="Select language" />
    </SelectTrigger>
    <SelectContent>
      {Object.keys(LANGUAGE_MAPPING).map((lang) => (
        <SelectItem key={lang} value={lang}>
          {LANGUAGE_MAPPING[lang]?.name}
        </SelectItem>
      ))}
      {/* Non-clickable item with a placeholder value */}
      <SelectItem value="disabled-r" disabled className="bg-gray-200 text-gray-500">
        R (Coming Soon)
      </SelectItem>
    </SelectContent>
  </Select>
  <div className="pt-4 rounded-md">
    <Editor
      height={"60vh"}
      value={code[language]}
      theme="vs-dark"
      onMount={() => {}}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
      }}
      language={LANGUAGE_MAPPING[language]?.monaco}
      onChange={(value) => {
        //@ts-ignore
        setCode({ ...code, [language]: value });
      }}
      defaultLanguage="python"
    />
  </div>
  <div className="flex justify-end">
    <Button
      disabled={status === SubmitStatus.PENDING}
      type="submit"
      className="mt-4 align-right bg-darkgray hover:bg-darkgray"
      onClick={session.data?.user ? submit : () => signIn()}
    >
      {session.data?.user
        ? status === SubmitStatus.PENDING
          ? "Submitting"
          : "Submit"
        : "Login to submit"}
    </Button>
  </div>
  <RenderTestcase testcases={testcases} />
</div>
  );
}

function renderResult(status: number | null) {
  switch (status) {
    case 1:
      return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    case 3:
      return <CheckIcon className="h-6 w-6 text-green-500" />;
    case 4:
      return <CircleX className="h-6 w-6 text-red-500" />;
    case 5:
      return <ClockIcon className="h-6 w-6 text-red-500" />;
    case 6:
      return <CircleX className="h-6 w-6 text-red-500" />;
    case 13:
      return <div className="text-gray-500">Internal Error!</div>;
    case 14:
      return <div className="text-gray-500">Exec Format Error!</div>;
    default:
      return <div className="text-gray-500">Runtime Error!</div>;
  }
}

function RenderTestcase({ testcases }: { testcases: SubmissionsType[] }) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {testcases.map((testcase, index) => (
        <div key={index} className="border rounded-md">
          <div className="px-2 pt-2 flex justify-center">
            <div className="">Test #{index + 1}</div>
          </div>
          <div className="p-2 flex justify-center">
            {renderResult(testcase.status_id)}
          </div>
        </div>
      ))}
    </div>
  );
}
