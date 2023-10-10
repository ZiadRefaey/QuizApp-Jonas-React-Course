import { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import MainContent from "./MainContent";
import Questions from "./Questions";
import { useReducer } from "react";
import StartScreen from "./StartScreen";
const initialState = {
  questions: [],
  status: "loading",
};
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    default:
      throw new Error("Action Unknown");
  }
}
function App() {
  const [{ status, questions }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  useEffect(function () {
    async function fetchQuestions() {
      try {
        const response = await fetch("http://localhost:8000/questions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        dispatch({ type: "dataRecieved", payload: data });
      } catch (error) {
        console.error("Network error: " + error.message);
        dispatch({ type: "dataFailed" });
      }
    }
    fetchQuestions();
  }, []);
  return (
    <>
      <div className="app">
        <Header />
        <MainContent>
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && (
            <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
          )}
          {status === "active" && <Questions />}
        </MainContent>
      </div>
    </>
  );
}

export default App;
