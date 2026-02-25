import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../utils/logger';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const bucketName = process.env.AWS_S3_BUCKET || '';

export const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string | null> => {
  if (!bucketName) {
    logger.warn('S3 bucket not configured');
    return null;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);
    
    const url = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
    logger.info(`File uploaded to S3: ${url}`);
    return url;
  } catch (error) {
    logger.error('S3 upload failed:', error);
    return null;
  }
};

export const getSignedUploadUrl = async (
  fileName: string,
  mimeType: string,
  expiresIn: number = 300
): Promise<{ url: string; key: string } | null> => {
  if (!bucketName) {
    logger.warn('S3 bucket not configured');
    return null;
  }

  try {
    const key = `uploads/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: mimeType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return { url, key };
  } catch (error) {
    logger.error('Failed to generate signed URL:', error);
    return null;
  }
};

export const getSignedDownloadUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string | null> => {
  if (!bucketName) {
    logger.warn('S3 bucket not configured');
    return null;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    logger.error('Failed to generate download URL:', error);
    return null;
  }
};