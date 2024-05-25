import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { S3Object } from '@cdktf/provider-aws/lib/s3-object';
import { Fn } from 'cdktf';
import { Construct } from 'constructs';

interface Options<T> {
    bucketName: string;
    folder: string;
    sharedState: {
        name: string;
        data: T;
    };
}

export { Options as SharedStateOnS3Options };

export class SharedStateOnS3<T> extends Construct {
    constructor(scope: Construct, name: string, options: Options<T>) {
        super(scope, name);

        const content = Fn.jsonencode(options.sharedState.data);
        new S3Object(this, 'shared-state', {
            bucket: options.bucketName,
            key: `${options.folder}/${options.sharedState.name}.json`,
            content,
            etag: Fn.md5(content)
        })
    }
}
