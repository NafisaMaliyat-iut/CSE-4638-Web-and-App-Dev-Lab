import Link from "next/link";
// import quizData from "./data"
import { apiUrl } from "./urls";

const fetchQuizzes = async () => {
  try {
    const res = await fetch(apiUrl + "quizzes", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to load quizzes");
    }
    return res.json();
  } catch (error) {
    console.log("Error fetching quizzes: ", error);
  }
};

const fetchHistory = async () => {
  try {
    const res = await fetch(apiUrl + "history", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to load history");
    }
    return res.json();
  } catch (error) {
    console.log("Error fetching history: ", error);
  }
};

export default async function Home() {
  // const [quizzes, setQuizzes] = useState([]);
  // const [completedQuizzes, setCompletedQuizzes] = useState([]);

  const { quizzes } = await fetchQuizzes();
  const { history } = await fetchHistory();
  const historyArray = Object.values(history);

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center m-2">
      {quizzes.map((quiz, index) => {
        const { quizName, _id } = quiz;
        const historyItem = historyArray.find((item) => item.quizId === _id);
        const isCompleted = historyItem !== undefined;
        const bgClass = isCompleted ? "bg-green-200" : "bg-white";
        const latestScore = isCompleted ? historyItem.latestScore : null;
  
        return (
          <div key={index} className={`shadow-md rounded-lg p-6 w-full ${bgClass}`}>
            <h2 className="text-xl font-semibold">{quizName}</h2>
            {isCompleted && (
              <p className="text-green-600 font-semibold">
                Latest Score: {latestScore}
              </p>
            )}
            <Link href={`/view-quiz/${_id}`}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                Start Quiz
              </button>
            </Link>
          </div>
        );
      })}
    </main>
  );
  
}
