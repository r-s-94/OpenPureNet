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
      <div className="followers-div text-lg flex flex-col items-center justify-center">
        Follower
        <p className="followers-label">{followers}</p>
      </div>
      <div className="following-div text-lg flex flex-col items-center justify-center">
        Gefolgt
        <p className="following-label">{following}</p>
      </div>
    </div>
  );
}
