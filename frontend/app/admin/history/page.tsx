"use client";

import { useReservation } from "@/app/stores/useReservation";
import { useEffect } from "react";

export default function AdminHistory() {
  const { history, fetchHistory } = useReservation();

  useEffect(() => {
    const init = async () => {
      await fetchHistory();
    };
    init();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="p-2 md:p-6 space-y-6">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto bg-white border border-gray-300 text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-3 md:px-4 py-2 border border-gray-300 text-left">
                Date Time
              </th>
              <th className="px-3 md:px-4 py-2 border border-gray-300 text-left">
                Username
              </th>
              <th className="px-3 md:px-4 py-2 border border-gray-300 text-left">
                Concert Name
              </th>
              <th className="px-3 md:px-4 py-2 border border-gray-300 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No reservation history.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item._id} className="text-left">
                  <td className="px-3 md:px-4 py-2 border border-gray-300">
                    {formatDateTime(item.timestamp)}
                  </td>
                  <td className="px-3 md:px-4 py-2 border border-gray-300">
                    {item.userId.username}
                  </td>
                  <td className="px-3 md:px-4 py-2 border border-gray-300">
                    {item.concertId ? item.concertId.name : "Concert deleted"}
                  </td>
                  <td className="px-3 md:px-4 py-2 border border-gray-300">
                    {item.action === "reserved" ? "Reserve" : "Cancel"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
