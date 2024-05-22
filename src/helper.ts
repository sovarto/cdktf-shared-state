import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { z, ZodTypeAny } from 'zod';
import { RemoteStateAccessConfigSchema } from './remoteStateAccessConfigSchema';

export async function getSharedState<T extends ZodTypeAny>(remoteStateAccessConfig: RemoteStateAccessConfigSchema,
                                                           sharedOutputName: string,
                                                           schema: T): Promise<z.infer<T>> {

    const client = new S3Client({
        region: remoteStateAccessConfig.region,
        credentials: {
            accessKeyId: remoteStateAccessConfig.accessKeyId,
            secretAccessKey: remoteStateAccessConfig.secretAccessKey
        }
    });

    const response = await client.send(new GetObjectCommand({
        Bucket: remoteStateAccessConfig.bucketName,
        Key: `${ remoteStateAccessConfig.sharedOutputsFolder }/${ sharedOutputName }.json`
    }));

    if (!response.Body) {
        throw new Error(`Couldn't get shared output '${ sharedOutputName }'`);
    }

    return schema.parse(JSON.parse(await response.Body.transformToString()));
}
