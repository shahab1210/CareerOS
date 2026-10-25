import { useRouteError } from 'react-router-dom';

export default function GlobalError() {
  const error = useRouteError() as Error;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Oops! Something went wrong</h1>
        <p className="mb-6 text-gray-600">
          We apologize for the inconvenience. An unexpected error occurred.
        </p>
        {error && (
          <div className="mb-6 rounded bg-gray-100 p-4 text-left text-sm text-gray-800 overflow-auto max-h-40">
            <code>{error.message || 'Unknown error'}</code>
          </div>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
