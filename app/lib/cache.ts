import { kv } from "@vercel/kv";

export async function get(key: string, namespace: string = "") {
    const result = await kv.hget<string>(`namespace-${namespace}`, key);
    if (!result ) {
        result;
    }
    return typeof result === 'string' ? JSON.parse(result as string) : result;
}

export async function set(key: string, value: any, namespace: string = "") {
    const data =  typeof value === 'string' ? value : JSON.stringify(value);
    console.log('data size', data.length);
    return await kv.hset(`namespace-${namespace}`, { [key]: data });
}

export async function del(key: string, namespace: string = "") {
    return await kv.del(`namespace-${namespace}`, key);
}
