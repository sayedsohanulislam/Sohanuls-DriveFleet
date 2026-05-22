const LoadingSpinner = ({ fullPage = true }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50"
        style={{ background: 'var(--navy)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="spinner" />
          <p className="font-ui text-sm tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="spinner" />
    </div>
  );
};

export default LoadingSpinner;
