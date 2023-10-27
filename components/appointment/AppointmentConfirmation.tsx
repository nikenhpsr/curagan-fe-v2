import axios from 'axios';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';

interface IAppointmentConfirmation {
  selectedDate: string;
  doctorId: string;
  setDisplaySuccessAppointmentCard: Dispatch<SetStateAction<boolean>>;
  handleAccept: () => Promise<void>; // Add handleAccept prop
}

export const AppointmentConfirmation = ({
  selectedDate,
  doctorId,
  setDisplaySuccessAppointmentCard,
  handleAccept, // Include the handleAccept prop
}: IAppointmentConfirmation) => {
  const [disableSubmit, setDisableSubmit] = useState(false);

  const handleSubmit = async () => {
    const role = localStorage.getItem('role');

    // Ignore appointment if role is doctor
    if (role === 'doctor') return;

    setDisableSubmit(true);

    try {
      // Call the handleAccept function, which is the same logic as the appointment creation.
      // This will accept the appointment.
      await handleAccept();
    } catch (error) {
      setDisableSubmit(false);
      console.log(error);
    }
  };

  return (
    <div className="w-full flex items-stretch justify-center gap-2">
      <Link
        href={'/beranda'}
        className="w-1/2 p-2 rounded-md text-sm text-center bg-red-600 text-white"
      >
        Kembali
      </Link>
      {disableSubmit ? (
        <button
          onClick={() => handleSubmit()}
          disabled
          className="w-1/2 p-2 rounded-md text-sm bg-slate-900 text-white bg-opacity-50"
        >
          Buat Appointment
        </button>
      ) : (
        <button
          onClick={() => handleSubmit()}
          className="w-1/2 p-2 rounded-md text-sm bg-slate-900 text-white"
        >
          Buat Appointment
        </button>
      )}
    </div>
  );
};
