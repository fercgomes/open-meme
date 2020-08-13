import { Injectable, BadRequestException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { v4 } from 'uuid';
import { MediaUploadReference } from './types';
import { config, S3 } from 'aws-sdk';

const makeFilename = function(filename: string) {
  const extension = filename.split('.').pop();
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9) +
    '.' +
    extension
  );
};

/** How long references are stored, before expiring. */
const MEDIA_UPLOAD_REFERENCE_TIMEOUT = 30;

@Injectable()
export class MediaService {
  /** Temporary references to media uploads are stored as a object.
   * ? is this a good solution?
   * ? what happens if this gets too big?
   */
  private temporaryReferences: { [id: string]: MediaUploadReference } = {};

  private s3 = new S3();
  private readonly bucket: string = 'geomeme-content';

  constructor(private schedulerRegistry: SchedulerRegistry) {
    config.update({ region: 'sa-east-1' });
  }

  /**
   * Generates a temporary reference to the uploaded image.
   * When the referece is expired, it is removed from storage.
   *
   * @param imageUrl URL to the image in storage.
   * @param key Filename of image in storage.
   */
  private addMediaReference(imageUrl: string, key: string): string {
    /** Generate a unique temporary ID for this upload. */
    const referenceId = v4();

    /** Store ID */
    this.temporaryReferences[referenceId] = { imageUrl, key };

    /** Set reference expiration */
    const callback = () => {
      console.warn(`Reference ${referenceId} expired.`);
      const key = this.temporaryReferences[referenceId].key;
      this.temporaryReferences[referenceId] = undefined;

      this.schedulerRegistry.deleteTimeout(referenceId);
      /** Delete file from S3 storage. */
      this.s3
        .deleteObject({ Bucket: this.bucket, Key: key })
        .promise()
        .then(() => {
          console.log(`Deleted ${key} from S3.`);
        })
        .catch(err => {
          console.log(`Deleting ${key} failed`, err);
        });
    };

    const timeout = setTimeout(callback, MEDIA_UPLOAD_REFERENCE_TIMEOUT * 1000);
    this.schedulerRegistry.addTimeout(referenceId, timeout);

    return referenceId;
  }

  /**
   * Uploads image to storage, and fetches
   * a temporary reference to it.
   */
  public async uploadImage(file: any) {
    console.log(file);
    const key = makeFilename(file.originalname);

    const data = await this.s3
      .upload({
        ACL: 'public-read',
        Bucket: this.bucket,
        Body: file.buffer,
        ContentType: file.mimetype,
        Key: key,
      })
      .promise();

    return { ref: this.addMediaReference(data.Location, key) };
  }

  /**
   * Validates an media upload reference. It will cancel
   * the timeout and return the content.
   *
   * @param referenceId Id of temporary reference.
   *
   * @returns URL to the media uploaded.
   *
   * @throws {BadRequestException}
   */
  public validateReference(referenceId: string): string {
    if (this.temporaryReferences[referenceId]) {
      /** Get media URL */
      const imageUrl = this.temporaryReferences[referenceId].imageUrl;

      /** Cancel the timeout */
      this.schedulerRegistry.deleteTimeout(referenceId);

      return imageUrl;
    } else {
      throw new BadRequestException('Reference is not valid.');
    }
  }
}
