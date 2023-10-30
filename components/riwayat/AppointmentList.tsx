import AppointmentInfo from './AppointmentInfo';

interface IAppointmentList {
  appointmentData: any;
  doctorsData: any;
  filterData: string;
}

export const AppointmentList = ({
  appointmentData,
  doctorsData,
  filterData,
}: IAppointmentList) => {
  return (
    <div className="w-full flex flex-col gap-3">
      {appointmentData.map((appointment: any) => {
        if (filterData == 'All') {
          return (
            <AppointmentInfo
              key={appointment.appointmentId}
              appointment={appointment}
              doctorsData={doctorsData}
            />
          );
        } else {
          return appointment.status == filterData ? (
            <AppointmentInfo
              key={appointment.appointmentId}
              appointment={appointment}
              doctorsData={doctorsData}
            />
          ) : (
            ''
          );
        }
      })}
    </div>
  );
};
