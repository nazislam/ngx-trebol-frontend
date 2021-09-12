// Copyright (c) 2020 Benjamin La Madrid
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Injectable } from '@angular/core';
import { Image } from 'src/app/models/entities/Image';
import { EntityDataLocalMemoryApiService } from '../entity-data.local-memory-api.abstract.service';

export const MOCK_IMAGES: Partial<Image>[] = [
  {
    filename: 'photo-1578116922645-3976907a7671.jpg',
    url: '/assets/img/products/photo-1578116922645-3976907a7671.jpg'
  },
  {
    filename: 'photo-1578172433613-9f1b258f7d5b.jpg',
    url: '/assets/img/products/photo-1578172433613-9f1b258f7d5b.jpg'
  },
  {
    filename: 'photo-1580143881495-b21dde95fc60.jpg',
    url: '/assets/img/products/photo-1580143881495-b21dde95fc60.jpg'
  }
];

@Injectable()
export class ImagesDataLocalMemoryApiService
  extends EntityDataLocalMemoryApiService<Image> {

  protected items: Image[] = MOCK_IMAGES.map(n => Object.assign(new Image(), n));

  constructor() {
    super();
  }
}
