import Options from "./Options";
export default function Questions({ question, answer, dispatch }) {
  return (
    <>
      <h4>{question.question}</h4>
      <Options question={question} answer={answer} dispatch={dispatch} />
    </>
  );
}
