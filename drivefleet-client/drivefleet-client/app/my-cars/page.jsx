import PrivateRoute from '../../src/components/PrivateRoute';
import MyAddedCars from '../../src/views/MyAddedCars';

export default function Page() {
  return (
    <PrivateRoute>
      <MyAddedCars />
    </PrivateRoute>
  );
}
