import { createContext, useContext, useState, ReactNode } from "react";
import BookingModal from "@/components/BookingModal";

interface BookingContextValue {
  openBooking: () => void;
}

const BookingContext = createContext<BookingContextValue>({ openBooking: () => {} });

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <BookingContext.Provider value={{ openBooking: () => setOpen(true) }}>
      {children}
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </BookingContext.Provider>
  );
};
