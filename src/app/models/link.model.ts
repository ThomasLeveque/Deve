import { BaseLink } from './base-link.model';

export class Link extends BaseLink {
  id?: string;

  constructor(json: any) {
    const jsonData = json.data();
    super(jsonData);
    this.id = json.id;
  }
}
