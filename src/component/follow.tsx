import "../responsive.css";

export default function Follow({
  followers,
  following,
}: {
  followers: number;
  following: number;
}) {
  return (
    <div className="follow-div mt-3 flex justify-center items-center gap-x-5">
      <div className="follower-div text-lg flex flex-col items-center justify-center">
        Follower
        <p className="follower-label">{followers}</p>
      </div>
      <div className="followed-div text-lg flex flex-col items-center justify-center">
        Gefolgt
        <p className="followed-label">{following}</p>
      </div>
    </div>
  );
}
