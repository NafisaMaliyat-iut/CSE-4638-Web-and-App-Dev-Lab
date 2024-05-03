"use client";

import { useEffect, useState } from "react";
import Result from "../../../components/result";
import QuizContent from "@/components/quiz";
import { apiUrl } from "@/app/urls";

export default function ViewQuizPage({ params }) {
  const { id } = params;
  const [quiz, setQuiz] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [questionTimes, setQuestionTimes] = useState({});
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log(id);
        const res = await fetch(apiUrl + "quizzes/" + id, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await res.json();
        console.log(data)
        setQuiz(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);


  useEffect(() => {
    if (timeRemaining === 0) {
      if (currentQuestionIndex < quiz?.questions?.length - 1) {
        // goToNextQuestion();
        setDisabled(true);
      } else {
        setQuizCompleted(true);
      }
    } else {
      setDisabled(false);
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

    console.log(newQuestionTimes);

    const nextIndex = currentQuestionIndex + 1;
    const remainingTime = questionTimes[nextIndex];
    if (remainingTime !== undefined) {
      setTimeRemaining(60 - remainingTime);
    } else {
      setTimeRemaining(60);
    }

    setCurrentQuestionIndex((index) => index + 1);
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((index) => index - 1);
    const previousQuestionIndex = currentQuestionIndex - 1;
    const remainingTime = questionTimes[previousQuestionIndex];

    const newQuestionTimes = { ...questionTimes };
    newQuestionTimes[currentQuestionIndex] = 60 - timeRemaining;
    setQuestionTimes(newQuestionTimes);

    console.log(questionTimes);

    if (remainingTime !== undefined) {
      setTimeRemaining(60 - remainingTime);
    } else {
      setTimeRemaining(60);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
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

    // let history = JSON.parse(localStorage.getItem("history")) || [];

    // const existingIndex = history.findIndex((item) => item.id === id);
    // if (existingIndex !== -1) {
    //   history.splice(existingIndex, 1);
    // }
    // const quizResult = {
    //   id: id,
    //   score: `${calculatedScore}/${quiz.questions.length}`,
    // };
    // history.push(quizResult);
    // localStorage.setItem("history", JSON.stringify(history));

    try{
      const res = await fetch(apiUrl + "history", {
        method: "POST",
        headers:{
          "Content-type":"application/json"
        },
        body: JSON.stringify({quizId: id, score:`${calculatedScore}/${quiz.questions.length}`})
      })
      if(res.ok){
      } else {
        throw new Error('Failed to save history')
      }
    }
    catch(error){
      console.log(error)
    }
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
          <div className="mb-4">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="block cursor-pointer mb-2">
                <input
                  type="radio"
                  name="options"
                  value={index}
                  checked={selectedOptions[currentQuestionIndex] === index}
                  onChange={() => handleOptionSelect(index)}
                  disabled={disabled}
                  className="mr-2 cursor-pointer h-full"
                />
                <span
                  className={`inline-block px-1 rounded-lg ${
                    selectedOptions[currentQuestionIndex] === index
                      ? "bg-blue-500 text-white font-bold"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>

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
