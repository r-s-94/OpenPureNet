export default function Follow({
  currentFollow,
  currentFollowed,
}: {
  currentFollow: number;
  currentFollowed: number;
}) {
  return (
    <div className="mt-5 flex justify-center items-center gap-x-5">
      <div className="text-lg flex flex-col items-center justify-center">
        Follower
        <p>{currentFollow}</p>
      </div>
      <div className="text-lg flex flex-col items-center justify-center">
        Gefolgt
        <p>{currentFollowed}</p>
      </div>
    </div>
  );
}
