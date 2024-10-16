
import { json, LoaderFunction, ActionFunction, redirect } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useNavigation } from '@remix-run/react';
import { getSession, commitSession } from '../services/encryptedSessionStorage';


interface MedicalData {
  patientName: string;
  dateOfBirth: string;
  medicalConditions: string;
  medications: string;
}

interface LoaderData {
  medicalData: MedicalData | null;
}

interface ActionData {
  success?: boolean;
  error?: string;
}

// Simulated database operations
let medicalDataStore: { [key: string]: MedicalData } = {};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const patientId = session.get('patientId');

  if (!patientId) {
   console.log(" throw new Response('Unauthorized', { status: 401 })");
  }

  // Fetch medical data from our simulated database
  const medicalData = medicalDataStore[patientId] || null;

  return json<LoaderData>({ medicalData });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const patientId = session.get('patientId');

  if (!patientId) {
    return json<ActionData>({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'create' || intent === 'update') {
    const medicalData: MedicalData = {
      patientName: formData.get('patientName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      medicalConditions: formData.get('medicalConditions') as string,
      medications: formData.get('medications') as string,
    };

    // Save to our simulated database
    medicalDataStore[patientId] = medicalData;

    return json<ActionData>({ success: true });
  }

  return json<ActionData>({ error: 'Invalid action' }, { status: 400 });
};

export default function MedicalDataRoute() {
  const { medicalData } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medical Data</h1>
      {medicalData ? (
        <Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="update" />
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              defaultValue={medicalData.patientName}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              defaultValue={medicalData.dateOfBirth}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">Medical Conditions</label>
            <textarea
              id="medicalConditions"
              name="medicalConditions"
              defaultValue={medicalData.medicalConditions}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="medications" className="block text-sm font-medium text-gray-700">Medications</label>
            <textarea
              id="medications"
              name="medications"
              defaultValue={medicalData.medications}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isSubmitting ? 'Updating...' : 'Update Medical Data'}
          </button>
        </Form>
      ) : (
        <Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="create" />
          <p className="text-lg font-medium text-gray-700">No medical data found. Please create your initial medical record:</p>
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">Medical Conditions</label>
            <textarea
              id="medicalConditions"
              name="medicalConditions"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="medications" className="block text-sm font-medium text-gray-700">Medications</label>
            <textarea
              id="medications"
              name="medications"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isSubmitting ? 'Creating...' : 'Create Medical Record'}
          </button>
        </Form>
      )}
      {actionData?.error && (
        <div className="mt-4 text-red-600 text-sm">{actionData.error}</div>
      )}
      {actionData?.success && (
        <div className="mt-4 text-green-600 text-sm">Medical data successfully saved!</div>
      )}
    </div>
  );
}