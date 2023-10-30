import { useEffect, useState } from 'react';
import {
  API_MY_APPOINTMENTS_ID,
  API_DOCTOR,
  API_PATIENT,
} from '@/lib/ApiLinks';
import AppointmentCard from '@/components/jadwal/AppointmentCard';

interface IAppointment {
  appointmentId: string;
  patientID: string;
  doctorID: string;
  datetime: string;
  status: string;
}

const DaftarAppointment = () => {
  const [data, setData] = useState<IAppointment[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [patientNames, setPatientNames] = useState<{ [key: string]: string }>(
    {},
  );
  const [doctorNames, setDoctorNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setDoctorId(localStorage.getItem('doctorId'));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token && doctorId) {
          const res = await fetch(API_MY_APPOINTMENTS_ID(doctorId), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            setError(new Error('An error occurred while fetching the data.'));
            return;
          }
          const jsonData = await res.json();
          setData(jsonData);

          const uniquePatientIDs = Array.from(
            new Set(jsonData.map((a: IAppointment) => a.patientID)),
          );
          const uniqueDoctorIDs = Array.from(
            new Set(jsonData.map((a: IAppointment) => a.doctorID)),
          );

          const allResponses = await Promise.all([
            ...uniquePatientIDs.map((id) =>
              fetch(`${API_PATIENT}/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res) => res.json()),
            ),
            ...uniqueDoctorIDs.map((id) =>
              fetch(`${API_DOCTOR}/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res) => res.json()),
            ),
          ]);

          const patientNameMap: { [key: string]: string } = {};
          const doctorNameMap: { [key: string]: string } = {};

          allResponses.forEach((response) => {
            if ('specialization' in response) {
              doctorNameMap[response.id] = response.name;
            } else {
              patientNameMap[response.id] = response.name;
            }
          });

          setPatientNames(patientNameMap);
          setDoctorNames(doctorNameMap);
        }
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchData();
  }, [token, doctorId]);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.map((appointment, index) => {
        const { appointmentId, patientID, doctorID, datetime, status } =
          appointment;
        return (
          <AppointmentCard
            key={index}
            appointmentId={appointmentId}
            patientID={patientID}
            doctorID={doctorID}
            datetime={datetime}
            status={status}
            patientName={patientNames[patientID] || 'Unknown'}
            doctorName={doctorNames[doctorID] || 'Unknown'}
          />
        );
      })}
    </div>
  );
};

export default DaftarAppointment;
