import { Concert } from "./concert";
import { User } from "./user";

export interface Reservation {
  _id: string;
  concertId: Concert;
  userId: string;
  status: "reserved" | "canceled";
  createdAt: string;
  canceledAt?: string;
}

export interface ReservationStats {
  reservedCount: number;
  canceledCount: number;
  totalCapacity: number;
}

export interface ReservationHistory {
  _id: string;
  concertId: Concert;
  userId: User;
  action: "reserved" | "canceled";
  timestamp: string
}
