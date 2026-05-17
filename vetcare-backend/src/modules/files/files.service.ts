import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class FilesService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const bucket = this.configService.get('AWS_S3_BUCKET');
    await this.s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private',
      })
      .promise();

    return `https://${bucket}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    const bucket = this.configService.get('AWS_S3_BUCKET');
    await this.s3.deleteObject({ Bucket: bucket, Key: key }).promise();
  }

  getSignedUrl(key: string, expiresIn: number = 3600): string {
    const bucket = this.configService.get('AWS_S3_BUCKET');
    return this.s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: expiresIn,
    });
  }
}
