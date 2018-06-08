/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { VisTypeProvider } from './';

export function ReactVisTypeProvider(Private, getAppState, config) {
  const VisType = Private(VisTypeProvider);

  class ReactVisController {
    constructor(el, vis) {
      this.el = el;
      this.vis = vis;
    }

    render(visData, updateStatus) {
      this.visData = visData;

      return new Promise((resolve) => {
        const Component = this.vis.type.visConfig.component;
        render(<Component
          config={config}
          vis={this.vis}
          appState={getAppState()}
          visData={visData}
          renderComplete={resolve}
          updateStatus={updateStatus}
        />, this.el);
      });
    }

    destroy() {
      unmountComponentAtNode(this.el);
    }
  }

  class ReactVisType extends VisType {
    constructor(opts) {
      opts.visualization = ReactVisController;

      super(opts);

      if (!this.visConfig.component) {
        throw new Error('Missing component for ReactVisType');
      }
    }
  }

  return ReactVisType;
}