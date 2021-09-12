// Copyright (c) 2020 Benjamin La Madrid
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/entities/User';
import { EntityDataLocalMemoryApiService } from '../entity-data.local-memory-api.abstract.service';

export const MOCK_USERS: Partial<User>[] = [
  {
    id: 1,
    name: 'admin',
    password: 'admin',
    createdOn: '2020-06-16',
    person: {
      id: 2,
      name: 'Administrator',
      idCard: '',
    },
    role: 'Administrator'
  }
];

@Injectable()
export class UsersDataLocalMemoryApiService
  extends EntityDataLocalMemoryApiService<User> {

  protected items: User[] = MOCK_USERS.map(n => Object.assign(new User(), n));

  constructor() {
    super();
  }
}
