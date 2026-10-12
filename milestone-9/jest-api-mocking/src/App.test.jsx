import { render, screen } from '@testing-library/react';
import App from './App';
import { fetchUsers } from './api';

jest.mock('./api', () => ({
  fetchUsers: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('shows users returned by the mocked API', async () => {
  fetchUsers.mockResolvedValue([
    { id: 1, name: 'Ada Lovelace' },
    { id: 2, name: 'Grace Hopper' },
  ]);

  render(<App />);

  expect(screen.getByRole('status')).toHaveTextContent('Loading users...');

  expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
  expect(screen.getByText('Grace Hopper')).toBeInTheDocument();
  expect(fetchUsers).toHaveBeenCalledTimes(1);
});

test('shows an error when the mocked API rejects', async () => {
  fetchUsers.mockRejectedValue(new Error('Network unavailable'));

  render(<App />);

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Could not load users: Network unavailable',
  );
  expect(fetchUsers).toHaveBeenCalledTimes(1);
});
