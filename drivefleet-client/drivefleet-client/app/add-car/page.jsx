import PrivateRoute from '../../src/components/PrivateRoute';
import AddCar from '../../src/views/AddCar';

export default function Page() {
  return (
    <PrivateRoute>
      <AddCar />
    </PrivateRoute>
  );
}
