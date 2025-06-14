// TODO: could be extended
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(500, error.message);
  }

  return new ApiError(500, 'An unexpected error occurred');
}


export function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    return response.json().then(data => {
      throw new ApiError(
        response.status,
        data.error?.message || 'An error occurred',
        data.error?.code
      );
    });
  }
  return response.json();
} 