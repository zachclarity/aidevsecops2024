// app/routes/_index.tsx
import { json, LoaderFunction, ActionFunction, redirect } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useNavigation } from '@remix-run/react';
import { getSession, commitSession } from '../sessions';

interface LoaderData {
  isLoggedIn: boolean;
  patientId?: string;
}

interface ActionData {
  error?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const patientId = session.get('patientId');

  if (patientId) {
    return json<LoaderData>({ isLoggedIn: true, patientId });
  }

  return json<LoaderData>({ isLoggedIn: false });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');

  // This is where you would validate the username and password
  // For this example, we'll use a very simple check
  if (username === 'testuser' && password === 'password') {
    session.set('patientId', 'TEST123');
    return redirect('/medical-data', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  return json<ActionData>({ error: 'Invalid username or password' }, { status: 400 });
};

export default function Index() {
  const { isLoggedIn, patientId } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to HIPAA-Compliant Medical Data App</h1>
      {isLoggedIn ? (
        <div>
          <p className="mb-4">You are logged in as Patient ID: {patientId}</p>
          <a 
            href="/medical-data" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View/Edit Medical Data
          </a>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <p className="mb-4">Please log in to access your medical data.</p>
          <Form method="post" className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </Form>
          {actionData?.error && (
            <div className="mt-4 text-red-600 text-sm">{actionData.error}</div>
          )}
        </div>
      )}
    </div>
  );
}