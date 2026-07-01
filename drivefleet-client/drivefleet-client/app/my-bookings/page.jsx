import PrivateRoute from '../../src/components/PrivateRoute';
import MyBookings from '../../src/views/MyBookings';

export default function Page() {
  return (
    <PrivateRoute>
      <MyBookings />
    </PrivateRoute>
  );
}
