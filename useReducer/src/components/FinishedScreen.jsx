export default function FinishedScreen({
  points,
  totalPoints,
  highscore,
  dispatch,
}) {
  const percentage = (points / totalPoints) * 100;
  return (
    <>
      <p className="result">
        You Scored
        <strong>
          {points} out of {totalPoints} ({Math.ceil(percentage)}%)
        </strong>
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}
