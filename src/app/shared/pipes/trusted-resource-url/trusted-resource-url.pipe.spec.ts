/*
 * Copyright (c) 2021 The Trébol eCommerce Project
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { waitForAsync } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { TrustedResourceUrlPipe } from './trusted-resource-url.pipe';

describe('TrustedResourceUrlPipe', () => {
  let mockDomSanitizer: Partial<DomSanitizer>;

  beforeEach(waitForAsync(() => {
    mockDomSanitizer = {
      bypassSecurityTrustResourceUrl() { return void 0; }
    };
  }));

  it('should create an instance', () => {
    const pipe = new TrustedResourceUrlPipe(mockDomSanitizer as DomSanitizer);
    expect(pipe).toBeTruthy();
  });
});
