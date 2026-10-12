import { useEffect, useState } from 'react';
import { fetchUsers } from './api';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchUsers()
      .then((data) => {
        if (isMounted) {
          setUsers(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Something went wrong');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p role="status">Loading users...</p>;
  }

  if (error) {
    return <p role="alert">Could not load users: {error}</p>;
  }

  return (
    <main>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </main>
  );
}
