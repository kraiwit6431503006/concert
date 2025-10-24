import { User } from "lucide-react";

export default function Home() {
  return (
    <div className=" bg-white border border-neutral-300 rounded-lg p-4 space-y-4">
      <h1 className="text-blue-400 font-bold text-2xl">Concert Name</h1>
      <div className="border-b border-neutral-300"></div>
      <p>
        Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor
        nibh urna sit ornare a. Proin dolor morbi id ornare aenean non. Fusce
        dignissim turpis sed non est orci sed in. Blandit ut purus nunc sed
        donec commodo morbi diam scelerisque.
      </p>
      <div className="flex justify-between">
        <div className="flex items-center">
          <User className="mr-2" /> 2000
        </div>
        <button type="button" className="px-4 py-2 bg-red-400 rounded-md text-white"> Cancel</button>
      </div>
    </div>
  );
}
