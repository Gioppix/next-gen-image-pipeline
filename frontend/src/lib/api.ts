import createClient from 'openapi-fetch';
import { env } from '$env/dynamic/public';
import type { paths } from '../types/api';

export const API_BASE = env.PUBLIC_API_BASE ?? 'http://localhost:8067';

export const api = createClient<paths>({ baseUrl: API_BASE });

export type JobStatus =
    paths['/transformations/{id}/status']['get']['responses'][200]['content']['application/json']['status'];
