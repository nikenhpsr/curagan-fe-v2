import { NextPage } from 'next';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSWR from 'swr';
import {
  API_APPOINTMENT,
  API_DOCTOR,
  API_PATIENT, // Import the patient API endpoint
} from '@/lib/ApiLinks';
import { LoadingCard } from '@/components/LoadingCard';
import { DoctorAppointmentCard } from '@/components/appointment/DoctorAppointmentCard';
import { DoctorScheduleCard } from '@/components/appointment/DoctorScheduleCard';
import { useState } from 'react';
import { AppointmentConfirmation } from '@/components/appointment/AppointmentConfirmation';
import { AppointmentSuccessful } from '@/components/appointment/AppointmentSuccessful';
import Notification from '@/components/Notifikasi';

const AppointmentDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch doctor data
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, isLoading, error } = useSWR(`${API_DOCTOR}/${id}`, fetcher);

  // Fetch patient data
  const fetcherPatient = (url: string) =>
    axios.get(url).then((res) => res.data);
  const { data: patientData } = useSWR(`${API_PATIENT}/${id}`, fetcherPatient); // Fetch patient data

  // Get date from DoctorScheduleCard
  const [selectedDate, setSelectedDate] = useState('');

  // Display success card if appointment is made
  const [displaySuccessAppointmentCard, setDisplaySuccessAppointmentCard] =
    useState(false);

  // State for managing notifications
  const [notification, setNotification] = useState<string | null>(null);

  // Function to show a notification
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      // Close the notification after a few seconds
      setNotification(null);
    }, 5000); // Adjust the time as needed
  };

  // Handle the "Accept" button click
  const handleAccept = async () => {
    try {
      // Define the data from the patient's request
      const appointmentData = {
        doctorId: data.id,
        patientId: patientData.id, // Use patientData to get the patient ID
        appointmentId: id,
        selectedDate: selectedDate,
      };

      // Use the correct variable when making an API request
      const response = await axios.post(
        `${API_APPOINTMENT}/create`,
        appointmentData,
      );
      if (response.status === 200) {
        // If the request is successful, show a notification.
        showNotification('Appointment request accepted!');
        setDisplaySuccessAppointmentCard(true);
      }
    } catch (error) {
      // Handle any errors or display an error message to the user.
      showNotification('Error: Appointment request could not be accepted.');
    }
  };

  return (
    <LayoutWrapper>
      <div className="relative w-full h-full flex flex-col justify-between gap-4 p-3">
        {isLoading ? (
          <LoadingCard />
        ) : (
          <>
            <div className="w-full flex flex-col gap-4">
              <DoctorAppointmentCard
                name={data.name}
                hospital={data.hospital}
                location={data.location}
              />

              <DoctorScheduleCard
                schedule={data.schedule}
                setSelectedDate={setSelectedDate}
              />
            </div>

            <AppointmentConfirmation
              selectedDate={selectedDate}
              doctorId={id as string}
              setDisplaySuccessAppointmentCard={
                setDisplaySuccessAppointmentCard
              }
              handleAccept={handleAccept} // Pass the handleAccept function
            />
          </>
        )}

        {displaySuccessAppointmentCard && <AppointmentSuccessful />}

        {notification && (
          <Notification
            message={notification}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </LayoutWrapper>
  );
};

export default AppointmentDetailsPage;
