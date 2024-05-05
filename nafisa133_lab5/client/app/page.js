"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "./urls";

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 2;
  const [maxFetchedPage, setMaxFetchedPage] = useState(-2); // only set to 1 when data for that page has been rendered
  const [maxPossiblePageNumber,setMaxPossiblePageNumber] = useState(1)
  const [loading,setLoading]=useState(false)

  const fetchQuizzes = async (page, limit) => {
    try {
      const res = await fetch(`${apiUrl}quizzes?page=${page}&limit=${limit}`);
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

  const fetchQuizCount = async () => {
    try {
      const res = await fetch(`${apiUrl}quizzes/count`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to load quiz count");
      }
      return res.json();
    } catch (error) {
      console.log("Error fetching quiz count: ", error);
    }
  };

  useEffect(() => {
    const fetchQuizzesData = async () => {
      setLoading(true)
      const fetchPages = [];
      for (let i = currentPage - 2; i < currentPage; i++) {
        if (i > 0) {
          fetchPages.push(i);
        }
      }
      fetchPages.push(currentPage);
      for (let i = currentPage + 1; i <= currentPage + 2; i++) {
        fetchPages.push(i);
      }

      const fetchedQuizzes = await Promise.all(
        fetchPages.map(async (page) => {
          const { quizzes } = await fetchQuizzes(page, limit);
          return quizzes;
        })
      );
      const allQuizzes = fetchedQuizzes.flat();
      console.log("number of quizzes fetched: ",allQuizzes.length)
      setQuizzes(allQuizzes);
      setMaxFetchedPage(currentPage);
      setLoading(false)
    };

    if (currentPage < maxFetchedPage - 2 || currentPage > maxFetchedPage + 2) {
      fetchQuizzesData(); //only fetch if it is out of range...
    }
  }, [currentPage]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      const { history } = await fetchHistory();
      setHistory(history);
    };

    const fetchQuizCountData = async () =>{
      const {count } = await fetchQuizCount();
      setMaxPossiblePageNumber(count/limit);
    }

    fetchHistoryData();
    fetchQuizCountData();
  }, []);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center m-2">
      {loading ? (
        <p>Loading Quizzes, please wait...</p>
      ) : (
        quizzes.map((quiz, index) => {
          const { quizName, page } = quiz;
  
          // Check if the quiz is for the current page
          if (page === currentPage) {
            const { _id } = quiz;
            const historyItem = history.find((item) => item.quizId === _id);
            const isCompleted = historyItem !== undefined;
            const bgClass = isCompleted ? "bg-green-200" : "bg-white";
            const latestScore = isCompleted ? historyItem.latestScore : null;
  
            return (
              <div key={index} className={`shadow-md rounded-lg p-6 w-full ${bgClass}`}>
                <h2 className="text-xl font-semibold">{quizName}</h2>
                {isCompleted && (
                  <p className="text-green-600 font-semibold">Latest Score: {latestScore}</p>
                )}
                <Link href={`/view-quiz/${_id}`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Start Quiz
                  </button>
                </Link>
              </div>
            );
          }
          return null; // Render null if the quiz is not for the current page
        })
      )}
      <div className="flex justify-center mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === maxPossiblePageNumber}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </main>
  );  
}
