import { json, ActionFunction } from '@remix-run/node';
import { getSession } from '../sessions';

interface ApiResponse {
  success: boolean;
}

// Simulated backend API (in reality, this should be a secure, HIPAA-compliant service)
const api = {
  syncData: (data: string): Promise<ApiResponse> => 
    Promise.resolve({ success: true }),
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const patientId = session.get('patientId');

  if (!patientId) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const encryptedData = formData.get('encryptedData');

  if (typeof encryptedData !== 'string') {
    return json({ error: 'Invalid data' }, { status: 400 });
  }

  try {
    // In a real app, you'd send this to your HIPAA-compliant backend
    const result = await api.syncData(encryptedData);

    return json(result);
  } catch (error) {
    console.error('Error syncing data:', error);
    return json({ error: 'Server error' }, { status: 500 });
  }
};