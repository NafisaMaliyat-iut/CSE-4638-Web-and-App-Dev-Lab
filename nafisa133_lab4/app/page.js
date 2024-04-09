"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import quizData from "./data"

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = () => {
      const localStorageData = JSON.parse(localStorage.getItem("quizzes")) || [];
      if(localStorageData?.length === 0){
        localStorage.setItem('quizzes', JSON.stringify(quizData));
        setQuizzes(quizData);
      }
      setQuizzes(localStorageData);
      const history = JSON.parse(localStorage.getItem("history") || []);
      setCompletedQuizzes(history);
    };

    fetchData();
  }, []);

  return (
    <main>
      {quizzes.map((quiz, index) => {
        const { quizName } = quiz;
        const completedQuiz = completedQuizzes.find((item) => item.id === index.toString());
        const isCompleted = completedQuiz !== undefined;
        const bgClass = isCompleted ? "bg-green-200" : "bg-white";

        return (
          <div key={index} className={`shadow-md rounded-lg p-6 m-4 w-80 ${bgClass}`}>
            <h2 className="text-xl font-semibold">{quizName}</h2>
            {isCompleted && (
              <p className="text-green-600 font-semibold">
                Completed - Score: {completedQuiz.score}
              </p>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => router.push(`/view-quiz/${index}`)}
            >
              Start Quiz
            </button>
          </div>
        );
      })}
    </main>
  );
}
