import UserTable from "./dashboard/page";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center bg-[white] dark:bg-[black] w-full fixed mt-10 gap-10">
      <p className="text-[20px]">Welcome!</p>
      <Link
        className=" border-blue-500 border-[1px] text-blue-500 rounded p-[2px] px-[6px] text-[20px]"
        href="/dashboard"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
