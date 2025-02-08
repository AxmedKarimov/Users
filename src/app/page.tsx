import Create from "./create/page";
import Users from "./users/page";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center gap-10 p-5">
      <Create />
      <Users />
    </div>
  );
}
