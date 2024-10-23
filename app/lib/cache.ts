import { kv } from '@vercel/kv';
import { UserDB } from '@/app/lib/definitions';

export async function get(key: string, entityType: string = '') {
  try {
    const result = await kv.hget<string>(`entity-type-${entityType}`, key);
    if (!result) {
      result;
    }
    console.log(`found ${entityType} in cache. (key: ${key})`);
    return typeof result === 'string' ? JSON.parse(result as string) : result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function set(key: string, value: any, entityType: string = '') {
  try {
    console.log(`saving ${entityType} to cache. (key: ${key})`);
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

export async function getUserById(userId: string) {
  return await get(userId, 'user');
}

export async function saveUser(user: UserDB) {
  return await set(user.id, user, 'user');
}

export async function removeUserById(userId: string) {
  return await del(userId, 'user');
}
