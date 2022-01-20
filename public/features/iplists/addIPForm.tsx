/*
 * Part of RedELK
 *
 * BSD 3-Clause License
 *
 * Copyright (c) Lorenzo Bernardi
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 * Authors:
 * - Lorenzo Bernardi
 */

import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment, { Moment } from 'moment';

import { EuiButton, EuiFieldText, EuiForm, EuiFormRow, EuiSelect, EuiSpacer } from '@elastic/eui';

import { CoreStart } from 'kibana/public';

import { CreateIPType } from '../../redux/types';
import { ActionCreators } from '../../redux/rootActions';
import { isValidIPv4 } from '../../helpers/ip_helper';

interface AddIPFormDeps {
  http: CoreStart['http'];
}

export const AddIPForm = ({ http }: AddIPFormDeps) => {
  // const md5Regexp: RegExp = /^[a-fA-F0-9]{32}$/;

  const dispatch = useDispatch();

  const [timestamp] = useState<Moment>(moment());
  const [iplistName, setIplistName] = useState<string>('');
  const [ip, setIp] = useState<string>('');

  const isIPValid: boolean = isValidIPv4(ip);

  const ipHasErrors: string[] = [!isIPValid ? 'A valid IP Address is required' : ''];

  const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    const payload: CreateIPType = {
      '@timestamp': timestamp.toISOString(),
      iplist: {
        name: iplistName,
        ip,
        source: 'kibana_app',
      },
    };
    dispatch(ActionCreators.createIP({ http, payload }));
    e.preventDefault();
    dispatch(ActionCreators.setShowAddIPForm(false));
  };

  const handleIPListNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setIplistName(e.target.value);
  };
  const handleIPChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIp(e.target.value);
  };

  return (
    <EuiForm component="form" onSubmit={handleFormSubmit}>
      <EuiFormRow label="IP List name" helpText="Select the list to add the IP to">
        <EuiSelect
          hasNoInitialSelection
          onChange={handleIPListNameChange}
          options={[
            { value: 'redteam', text: 'redteam' },
            { value: 'customer', text: 'customer' },
            { value: 'blueteam', text: 'blueteam' },
            { value: 'unknown', text: 'unknown' },
          ]}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow
        label="IP (required)"
        helpText="IP address to add (single IP or CIDR notation accepted)"
        error={ipHasErrors}
        isInvalid={!isIPValid}
      >
        <EuiFieldText name="iplistName" onChange={handleIPChange} isInvalid={!isIPValid} />
      </EuiFormRow>

      <EuiButton type="submit" fill>
        Add IP
      </EuiButton>
    </EuiForm>
  );
};
