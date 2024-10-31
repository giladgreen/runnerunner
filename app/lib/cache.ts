import { kv } from '@vercel/kv';
import { FeatureFlagDB, UserDB } from '@/app/lib/definitions';
const DEBUG_MODE = process.env.NODE_ENV !== 'development';
export async function get(key: string, entityType: string = '') {
  try {
    const result = await kv.hget<string>(`entity-type-${entityType}`, key);
    if (!Boolean(result)) {
      result;
    }
    DEBUG_MODE && console.log(`found ${entityType} in cache. (key: ${key})`);
    return typeof result === 'string' ? JSON.parse(result as string) : result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function set(key: string, value: any, entityType: string = '') {
  try {
    DEBUG_MODE && console.log(`saving ${entityType} to cache. (key: ${key})`);
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    return await kv.hset(`entity-type-${entityType}`, { [key]: data });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function del(key: string, entityType: string = '') {
  try {
    return await kv.del(`entity-type-${entityType}`, key);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUserById(userId: string): Promise<UserDB | null> {
  return await get(userId, 'user');
}

export async function saveUser(user: UserDB): Promise<void> {
  await set(user.id, user, 'user');
}

export async function removeUserById(userId: string): Promise<void> {
  await del(userId, 'user');
}

export async function getFF(): Promise<FeatureFlagDB[] | null> {
  return await get('flag', 'flags');
}

export async function saveFF(flags: FeatureFlagDB[]): Promise<void> {
  await set('flag', flags, 'flags');
}
