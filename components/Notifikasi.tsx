import React, { FunctionComponent } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: FunctionComponent<NotificationProps> = ({
  message,
  onClose,
}) => {
  return (
    <div className="notification">
      {message}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Notification;
