"use client";
import AddNotes from "@/components/AddNotes";
import { useUser } from "@/providers/UserContext";
import AllNotes from "@/components/AllNotes";
import PinnedNotes from "@/components/PinnedNotes";

const Home = () => {
  const { loading } = useUser();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex w-screen min-h-screen">

      <div className="flex flex-grow flex-col w-full h-full mt-8 px-4 space-y-10 overflow-y-auto justify-center items-center -ml-10 lg:ml-10">

        <div className="w-full max-w-4xl">
          <AddNotes />
        </div>
        <div className="flex flex-col justify-center gap-4 w-full mt-4">
          <PinnedNotes />
          <AllNotes />
        </div>

      </div>
    </div>
  );
};

export default Home;