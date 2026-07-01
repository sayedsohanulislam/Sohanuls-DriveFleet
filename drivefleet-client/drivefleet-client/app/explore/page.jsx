import { Suspense } from 'react';
import ExploreCars from '../../src/views/ExploreCars';
import LoadingSpinner from '../../src/components/LoadingSpinner';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ExploreCars />
    </Suspense>
  );
}
