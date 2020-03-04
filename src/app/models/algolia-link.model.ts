import { BaseLink } from './base-link.model';

export class ALgoliaLink extends BaseLink {
  objectID?: string;

  constructor(json: any) {
    super(json);
    this.objectID = json.objectID;
  }
}
