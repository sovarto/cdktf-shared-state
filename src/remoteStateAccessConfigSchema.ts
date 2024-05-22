import { z } from 'zod';

export const RemoteStateAccessConfigSchema = z.strictObject({
    bucketName: z.string(),
    region: z.string(),
    dynamoDbTableName: z.string(),
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
    stateFileFolder: z.string(),
    sharedOutputsFolder: z.string()
});

export type RemoteStateAccessConfigSchema = z.infer<typeof RemoteStateAccessConfigSchema>;
