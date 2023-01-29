import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { stringToNumberTransformer } from 'src/utils/transformers/stringToNumber';

export class IdsToNumberPipe implements PipeTransform {
  allowedIds = ['accountId', 'userId', 'channelId'];
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'param' && this.allowedIds.includes(metadata.data)) {
      value = stringToNumberTransformer(metadata.data, value);
    }
    return value;
  }
}
