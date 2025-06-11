import { toast } from '@/shared/components/ui/toast';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new ApiError(
      response.status,
      data.message || 'Something went wrong',
      data
    );
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
    throw error;
  }

  return data;
} 