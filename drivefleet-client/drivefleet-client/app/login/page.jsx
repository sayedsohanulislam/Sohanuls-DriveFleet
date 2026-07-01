import { Suspense } from 'react';
import Login from '../../src/views/Login';
import LoadingSpinner from '../../src/components/LoadingSpinner';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Login />
    </Suspense>
  );
}
