import { kv } from '@vercel/kv';
import { UserDB } from '@/app/lib/definitions';

export async function get(key: string, namespace: string = '') {
  try {
    const result = await kv.hget<string>(`namespace-${namespace}`, key);
    if (!result) {
      result;
    }
    return typeof result === 'string' ? JSON.parse(result as string) : result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function set(key: string, value: any, namespace: string = '') {
  try {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    console.log('data size', data.length);
    return await kv.hset(`namespace-${namespace}`, { [key]: data });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function del(key: string, namespace: string = '') {
  try {
    return await kv.del(`namespace-${namespace}`, key);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUserById(userId: string) {
  return await get(userId, 'users');
}
export async function saveUser(user: UserDB) {
  return await set(user.id, user, 'users');
}

export async function removeUserById(userId: string) {
  return await del(userId, 'users');
}
