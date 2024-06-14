import { v2 as couldinary } from 'cloudinary';
export async function POST(request: Request) {
const body = (await request.json()) as { paramsToSign: Record<string,string> };
const {paramsToSign} = body;
const signature = couldinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);
return Response.json({signature});
}
