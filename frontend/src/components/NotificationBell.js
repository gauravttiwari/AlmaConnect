import React, { useEffect, useState } from 'react';
import socket from '../utils/socket';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    socket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });
    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(!open)} className="btn-primary">
        🔔 Notifications {notifications.length > 0 && <span>({notifications.length})</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', boxShadow: '0 2px 8px #ccc', minWidth: 250, zIndex: 10 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 8 }}>
            {notifications.length === 0 && <li>No notifications</li>}
            {notifications.map((n, i) => (
              <li key={i} style={{ padding: 8, borderBottom: '1px solid #eee' }}>{n.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
