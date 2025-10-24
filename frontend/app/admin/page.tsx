"use client";

import { Award, Save, Trash2, User, XCircle } from "lucide-react";
import { useState } from "react";

type Stat = {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
};

export default function AdminHome() {
  const tabs = ["Overview", "Create"];
  const [activeTab, setActiveTab] = useState("Overview");

  const stats: Stat[] = [
    { title: "Total Seats", value: 500, icon: User, color: "bg-sky-700" },
    { title: "Reserved", value: 320, icon: Award, color: "bg-teal-500" },
    { title: "Canceled", value: 50, icon: XCircle, color: "bg-red-400" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`rounded-md p-6 flex flex-col items-center justify-center text-white ${stat.color}`}
            >
              <Icon className="w-12 h-12 mb-3" />
              <span className="text-lg font-medium">{stat.title}</span>
              <span className="text-2xl font-bold mt-2">{stat.value}</span>
            </div>
          );
        })}
      </div>

      <div className="flex mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 mr-4 font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-400"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab}
            {/* underline for active tab */}
            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400 " />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className=" bg-white border border-neutral-300 rounded-lg p-4 space-y-4">
          <h1 className="text-blue-400 font-bold text-2xl">Concert Name</h1>
          <div className="border-b border-neutral-300"></div>
          <p>
            Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida
            porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean
            non. Fusce dignissim turpis sed non est orci sed in. Blandit ut
            purus nunc sed donec commodo morbi diam scelerisque.
          </p>
          <div className="flex justify-between">
            <div className="flex items-center">
              <User className="mr-2" /> 2000
            </div>
            <button
              type="button"
              className="px-4 flex py-2 bg-red-400 rounded-md text-white"
            >
              <Trash2 className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}

      {activeTab === "Create" && (
        <div className="bg-white border border-neutral-300 rounded-lg p-6 space-y-6 shadow-sm">
          <h1 className="text-blue-500 font-bold text-2xl">Create</h1>
          <div className="border-b border-neutral-300"></div>

          <form>
            <div className="grid grid-cols-12 gap-4">
              {/* Concert Name */}
              <div className="col-span-12 md:col-span-6">
                <label className="block mb-2 font-medium text-gray-700">
                  Concert Name
                </label>
                <input
                  type="text"
                  placeholder="Please input concert name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              {/* Total of Seats */}
              <div className="col-span-12 md:col-span-6">
                <label
                  htmlFor="total-seats"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Total of Seats
                </label>
                <div className="relative">
                  <input
                    id="total-seats"
                    type="number"
                    placeholder="500"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="col-span-12">
                <label className="block mb-2 font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Please input description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                  rows={4}
                />
              </div>

              <div className="col-span-12 flex justify-end">
                <button
                  type="button"
                  className="px-4 flex py-2 bg-blue-400 rounded-md text-white"
                >
                  <Save className="mr-2" />
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
