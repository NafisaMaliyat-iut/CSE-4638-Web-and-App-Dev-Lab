import Link from "next/link";

export default function Result({score, quiz, selectedOptions, questionTimes }) {
  //add up the total time
  const totalTimeTaken = Object.values(questionTimes).reduce((acc, curr) => acc + curr, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{quiz.quizName}</h1>
      {/* retake and view other quiz button  */}
      <div className="flex space-x-4 py-2">
        <button onClick={() => window.location.reload()}>
          <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Retake Quiz
          </span>
        </button>
        <Link href="/">
          <span className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            View Other Quizzes
          </span>
        </Link>
      </div>

      
      <div className="my-2">
        <p className="text-lg font-semibold">Total Time Taken: {totalTimeTaken} seconds</p>
        <p className="text-lg font-semibold">Total Score: {score}/{quiz.questions.length}</p>
      </div>

      <div>
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
            <p>
              {question.prompt}
              {/* display tick or cross for answered correctly or wrongly   */}
              {selectedOptions[index] === question.correctAnswer ? (
                <span className="text-green-600 pb-2">✔</span>
              ) : (
                <span className="text-red-600 pb-2">✘</span>
              )}
            </p>
            {selectedOptions[index] === undefined && <p className="text-gray-600">Not Attempted</p>}
            
            
            <ul>
              {question.options.map((option, optionIndex) => (
                <li
                  key={optionIndex}
                  className={`
                  ${
                    selectedOptions[index] !== undefined &&
                    selectedOptions[index] === optionIndex &&
                    selectedOptions[index] !== question.correctAnswer
                      ? "font-semibold text-red-600"
                      : ""
                  }
                  ${optionIndex===question.correctAnswer? "font-semibold text-green-600":""}`
                }                
                >
                  {option}
                </li>
              ))}
            </ul>

            <p>Time Taken: {questionTimes[index] || 0} seconds</p>
          </div>
        ))}
      </div>
    </div>
  );
}
