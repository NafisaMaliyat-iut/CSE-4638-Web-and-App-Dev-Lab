"use client";

import { useEffect, useState } from "react";
import Result from "./result";

export default function ViewQuizPage({ params }) {
  const { id } = params;
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [questionTimes, setQuestionTimes] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
      const selectedQuiz = quizzes[id];
      if (selectedQuiz) {
        setQuiz(selectedQuiz);
      } else {
        console.error(`Quiz with id ${id} not found.`);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (timeRemaining === 0) {
      if (currentQuestionIndex < quiz?.questions.length - 1) {
        goToNextQuestion();
      } else {
        setQuizCompleted(true);
      }
    } else {
      const timer = setTimeout(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const goToNextQuestion = () => {
    const newQuestionTimes = { ...questionTimes };
    newQuestionTimes[currentQuestionIndex] = 60 - timeRemaining;
    setQuestionTimes(newQuestionTimes);
    setCurrentQuestionIndex((index) => index + 1);
    setTimeRemaining(60);
  };

  const goToPreviousQuestion = () => {
    const previousQuestionIndex = currentQuestionIndex - 1;
    const remainingTime = questionTimes[previousQuestionIndex];

    if (remainingTime !== undefined) {
      setCurrentQuestionIndex(previousQuestionIndex);
      setTimeRemaining(60 - remainingTime);
    } else {
      setCurrentQuestionIndex((index) => index - 1);
      setTimeRemaining(60);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    const newQuestionTimes = { ...questionTimes };
    newQuestionTimes[currentQuestionIndex] = 60 - timeRemaining;
    setQuestionTimes(newQuestionTimes);
    setQuizCompleted(true);

    const calculatedScore = Object.values(selectedOptions).reduce((acc, optionIndex, index) => {
      if (optionIndex === quiz.questions[index].correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
    setScore(calculatedScore);

    let history = JSON.parse(localStorage.getItem("history")) || [];

    const existingIndex = history.findIndex((item) => item.id === id);
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    const quizResult = {
      id: id,
      score: `${calculatedScore}/${quiz.questions.length}`,
    };
    history.push(quizResult);
    localStorage.setItem("history", JSON.stringify(history));
  };

  if (!id) {
    return <div>No quiz ID provided.</div>;
  }

  if (!quiz) {
    return <div>Loading...</div>;
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return <div>No questions found for this quiz.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="p-4">
      {quizCompleted ? (
        <Result
          score={score}
          quiz={quiz}
          selectedOptions={selectedOptions}
          questionTimes={questionTimes}
        />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">{quiz.quizName}</h1>
          <h2 className="text-lg mb-2">
            Question {currentQuestionIndex + 1}/{quiz?.questions.length}
          </h2>
          <p className="mb-4">{currentQuestion.prompt}</p>
          <ul className="mb-4">
            {currentQuestion.options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`cursor-pointer ${
                  selectedOptions[currentQuestionIndex] === index
                    ? "font-bold text-blue-500"
                    : "font-normal"
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
          <p className="mb-2">Time Remaining: {timeRemaining} seconds</p>
          <div className="space-x-2 mb-4">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded ${
                currentQuestionIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            <button
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
              className={`px-4 py-2 rounded ${
                currentQuestionIndex === quiz.questions.length - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
          <button
            onClick={handleSubmitQuiz}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
}
