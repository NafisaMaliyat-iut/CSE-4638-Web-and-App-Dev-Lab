"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "../urls";

export default function Create() {
  const router = useRouter();
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([
    { prompt: "", options: ["", "", "",""], correctAnswer: 0 },
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { prompt: "", options: ["", "", "",""], correctAnswer: 0 }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = parseInt(value);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const quizData = {
    //   quizName: quizName,
    //   questions: questions,
    // };
    // const existingData = JSON.parse(localStorage.getItem("quizzes")) || [];
    // const newData = [...existingData, quizData];
    // localStorage.setItem("quizzes", JSON.stringify(newData));
    
    try{
      const res = await fetch(apiUrl + "quizzes", {
        method: "POST",
        headers:{
          "Content-type":"application/json"
        },
        body: JSON.stringify({quizName, questions})
      })
      if(res.ok){
        router.push('/')
      } else {
        throw new Error('Failed to create quiz')
      }
    }
    catch(error){
      console.log(error)
    }
  };

  return (
    <div className="py-2 bg-gray-100 flex flex-col justify-center">
      <div className="relative max-w-xl mx-auto">
        <div className="relative mx-0 p-10">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h1 className="text-center font-bold text-2xl">Create Quiz</h1>

              <div>
                <label htmlFor="quizName" className="block text-sm font-medium text-gray-700">
                  Quiz Name:
                </label>
                <input
                  type="text"
                  id="quizName"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <hr className="mt-4" />

              {questions.map((question, index) => (
                <div key={index}>
                  <label
                    htmlFor={`question${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Question {index + 1}:
                  </label>
                  <input
                    type="text"
                    id={`question${index}`}
                    value={question.prompt}
                    onChange={(e) => handleQuestionChange(index, "prompt", e.target.value)}
                    required
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />

                  <label className="block text-sm font-medium text-gray-700">Options:</label>
                  {question.options.map((option, optionIndex) => (
                    <input
                      type="text"
                      key={optionIndex}
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                      required
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  ))}

                  <label
                    htmlFor={`correctAnswer${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Correct Answer:
                  </label>
                  <select
                    id={`correctAnswer${index}`}
                    value={question.correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                    required
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  >
                    {question.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <hr className="mt-4" />
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddQuestion}
                className="mr-4 text-center mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 "
              >
                Add Question
              </button>

              <div className="w-full">
                <button
                  type="submit"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
