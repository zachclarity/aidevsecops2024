import { Form, useActionData, useNavigation } from '@remix-run/react';

interface ActionData {
  error?: string;
}

export default function LoginForm() {
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Form method="post" action="/login" className="space-y-4">
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
      {actionData?.error && (
        <div className="text-red-600 text-sm">{actionData.error}</div>
      )}
    </Form>
  );
}
