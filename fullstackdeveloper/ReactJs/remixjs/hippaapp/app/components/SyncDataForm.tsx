// app/components/SyncDataForm.tsx
import { Form, useNavigation, useActionData } from '@remix-run/react';
import { json } from '@remix-run/node';

interface ActionData {
  success?: boolean;
  error?: string;
}

export default function SyncDataForm() {
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();

  const isSyncing = navigation.state === 'submitting';

  return (
    <Form method="post" action="/sync">
      <div className="mb-4">
        <button
          type="submit"
          disabled={isSyncing}
          className={`${
            isSyncing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
          } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
          {isSyncing ? 'Syncing...' : 'Sync Data'}
        </button>
      </div>
      {actionData?.success && (
        <div className="mb-4 text-green-600">Data synced successfully!</div>
      )}
      {actionData?.error && (
        <div className="mb-4 text-red-600">Error: {actionData.error}</div>
      )}
    </Form>
  );
}