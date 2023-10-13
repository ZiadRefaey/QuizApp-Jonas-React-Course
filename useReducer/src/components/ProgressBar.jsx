export default function ProgressBar({
  index,
  numQuestions,
  points,
  answer,
  totalPoints,
}) {
  return (
    <>
      <header className="progress">
        <progress
          id="progress-bar"
          max={numQuestions}
          value={index + Number(answer !== null)}
        ></progress>
        <p>
          Question <strong>{index + 1}</strong> /{numQuestions}
        </p>
        <p>
          <strong>
            {points}/{totalPoints}
          </strong>
        </p>
      </header>
    </>
  );
}
