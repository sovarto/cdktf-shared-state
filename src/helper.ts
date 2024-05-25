import { GetObjectCommand, NoSuchKey, S3Client } from '@aws-sdk/client-s3';
import { z, ZodTypeAny } from 'zod';
import { RemoteStateAccessConfigSchema } from './remoteStateAccessConfigSchema';

export async function getSharedState<T extends ZodTypeAny>(remoteStateAccessConfig: RemoteStateAccessConfigSchema,
                                                           sharedStateName: string,
                                                           schema: T): Promise<z.infer<T>> {

    const client = new S3Client({
        region: remoteStateAccessConfig.region,
        credentials: {
            accessKeyId: remoteStateAccessConfig.accessKeyId,
            secretAccessKey: remoteStateAccessConfig.secretAccessKey
        }
    });

    const key = `${ remoteStateAccessConfig.sharedStateFolder }/${ sharedStateName }.json`;

    try {
        const response = await client.send(new GetObjectCommand({
            Bucket: remoteStateAccessConfig.bucketName,
            Key: key
        }));

        if (!response.Body) {
            throw new Error(`Couldn't get shared output '${ sharedStateName }'`);
        }

        return schema.parse(JSON.parse(await response.Body.transformToString()));
    } catch (error) {
        if (error instanceof NoSuchKey) {
            throw new Error(`Error reading file from bucket '${ remoteStateAccessConfig.bucketName }' and key '${ key }'`,
                { cause: error });
        } else {
            throw error;
        }
    }
}
