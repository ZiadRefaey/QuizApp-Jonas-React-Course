import { useEffect } from "react";
import "../App.css";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import MainContent from "./MainContent";
import Questions from "./Questions";
import NextButton from "./NextButton";
import { useReducer } from "react";
import StartScreen from "./StartScreen";
import ProgressBar from "./ProgressBar";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  remainingSeconds: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        remainingSeconds: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...state,
        points: 0,
        index: 0,
        status: "ready",
        remainingSeconds: null,
        answer: null,
      };
    case "tick":
      return {
        ...state,
        remainingSeconds: state.remainingSeconds - 1,
        status: state.remainingSeconds === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action Unknown");
  }
}
function App() {
  const [
    { status, questions, index, answer, points, highscore, remainingSeconds },
    dispatch,
  ] = useReducer(reducer, initialState);
  const totalPoints = questions.reduce((prev, cur) => prev + cur.points, 0);
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
          {status === "active" && (
            <>
              <ProgressBar
                numQuestions={numQuestions}
                index={index}
                points={points}
                totalPoints={totalPoints}
                answer={answer}
              />
              <Questions
                dispatch={dispatch}
                answer={answer}
                question={questions[index]}
              />
              <Footer>
                <NextButton
                  dispatch={dispatch}
                  answer={answer}
                  numQuestions={numQuestions}
                  index={index}
                />
                <Timer
                  dispatch={dispatch}
                  remainingSeconds={remainingSeconds}
                />
              </Footer>
            </>
          )}
          {status === "finished" && (
            <FinishedScreen
              points={points}
              totalPoints={totalPoints}
              highscore={highscore}
              dispatch={dispatch}
            />
          )}
        </MainContent>
      </div>
    </>
  );
}

export default App;
