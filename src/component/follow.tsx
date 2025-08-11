import "../responsive.css";

export default function Follow({
  currentFollow,
  currentFollowed,
}: {
  currentFollow: number;
  currentFollowed: number;
}) {
  return (
    <div className="follow-div mt-5 bg-white flex justify-center items-center gap-x-5">
      <div className="follower-div text-lg flex flex-col items-center justify-center">
        Follower
        <p className="follower-label">{currentFollow}</p>
      </div>
      <div className="followed-div text-lg flex flex-col items-center justify-center">
        Gefolgt
        <p className="followed-label">{currentFollowed}</p>
      </div>
    </div>
  );
}
