import React, {ChangeEvent, useState} from 'react';
import {useDispatch} from 'react-redux';
import moment, {Moment} from 'moment';

import {
  EuiButton,
  EuiDatePicker,
  EuiFieldNumber,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
} from '@elastic/eui';

import {CoreStart} from 'kibana/public';

import {CreateIOCType} from "../../redux/types";
import {ActionCreators} from "../../redux/rootActions";

interface AddIOCFormDeps {
  http: CoreStart['http'];
}

export const AddIOCForm = ({http}: AddIOCFormDeps) => {

  const md5Regexp: RegExp = /^[a-fA-F0-9]{32}$/;

  const dispatch = useDispatch();

  const [iocType, setIocType] = useState<string>('');
  const [timestamp, setTimestamp] = useState<Moment>(moment());
  const [c2Message, setC2Message] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');

  const [fileName, setFileName] = useState<string>('');
  const [fileHash, setFileHash] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [domainName, setDomainName] = useState<string>('');

  const isFileHashValid: boolean = iocType !== 'file' || md5Regexp.test(fileHash);
  const isFileNameValid: boolean = fileName.length > 0;
  const isDomainNameValid: boolean = iocType !== "domain" || domainName !== "";

  const fileNameErrors: string[] = [!isFileNameValid ? 'File name is required' : ''];
  const fileHashErrors: string[] = ['Invalid file hash'];
  const domainNameErrors: string[] = [!isDomainNameValid ? 'Domain name is required' : ''];

  const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    const payload: CreateIOCType = {
      '@timestamp': timestamp.toISOString(),
      ioc: {
        type: iocType,
        domain: domainName
      },
      file: {
        name: fileName,
        size: fileSize,
        hash: {
          md5: fileHash
        }
      },
      c2: {
        message: c2Message
      },
      host: {
        name: hostName
      },
      user: {
        name: userName
      }
    };
    dispatch(ActionCreators.createIOC({http, payload}));
    e.preventDefault();
    dispatch(ActionCreators.setShowAddIOCForm(false));
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setIocType(e.target.value);
  };

  // Common to all IOC types
  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const handleHostNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHostName(e.target.value);
  };
  const handleC2MessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setC2Message(e.target.value);
  };
  const handleTimestampChange = (date: Moment) => {
    setTimestamp(date);
  };

  // File / Service
  const handleFileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };
  const handleFileHashChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileHash(e.target.value);
  };
  const handleFileSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileSize(e.target.value);
  };

  // Domain
  const handleDomainNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDomainName(e.target.value);
  };


  const timestampFormRow = (
    <EuiFormRow
      label="Timestamp (required)"
      helpText="When has the IOC been seen?"
    >
      <EuiDatePicker
        showTimeSelect
        selected={timestamp}
        onChange={handleTimestampChange}
        timeIntervals={1}
      />
    </EuiFormRow>
  );
  const fileNameFormRow = (
    <EuiFormRow
      label="File name (required)"
      helpText="Name of the file related to the IOC."
      error={fileNameErrors}
      isInvalid={!isFileNameValid}
    >
      <EuiFieldText
        name="fileName"
        onChange={handleFileNameChange}
        isInvalid={!isFileNameValid}
      />
    </EuiFormRow>
  );
  const fileHashFormRow = (
    <EuiFormRow
      label="File hash (MD5)"
      helpText="MD5 hash of the file related to the IOC."
      error={fileHashErrors}
      isInvalid={!isFileHashValid}
    >
      <EuiFieldText
        name="fileHash"
        onChange={handleFileHashChange}
        isInvalid={!isFileHashValid}
      />
    </EuiFormRow>
  );
  const fileSizeFormRow = (
    <EuiFormRow
      label="File size"
      helpText="Size of the file related to the IOC (in bytes)."
    >
      <EuiFieldNumber
        name="fileSize"
        onChange={handleFileSizeChange}
      />
    </EuiFormRow>
  );
  const userNameFormRow = (
    <EuiFormRow
      label="User name"
      helpText="Optional name of the target user where the IOC occurred."
    >
      <EuiFieldText
        name="userName"
        onChange={handleUserNameChange}
      />
    </EuiFormRow>
  );
  const hostNameFormRow = (
    <EuiFormRow
      label="Host name"
      helpText="Optional name of the target host where the IOC occurred."
    >
      <EuiFieldText
        name="hostName"
        onChange={handleHostNameChange}
      />
    </EuiFormRow>
  );
  const c2MessageFormRow = (
    <EuiFormRow
      label="C2 Message"
      helpText="Optional message that will be populated in the `c2.message` field."

    >
      <EuiFieldText
        name="c2Message"
        onChange={handleC2MessageChange}
      />
    </EuiFormRow>
  );
  const domainNameFormRow = (
    <EuiFormRow
      label="Domain name"
      helpText="Domain name that will be populated in the `ioc.domain` field."
      error={domainNameErrors}
      isInvalid={!isDomainNameValid}
    >
      <EuiFieldText
        name="domainName"
        onChange={handleDomainNameChange}
        isInvalid={!isDomainNameValid}
      />
    </EuiFormRow>
  );
  const fileForm = iocType === 'file' ? (
    <>
      {timestampFormRow}
      {fileNameFormRow}
      {fileHashFormRow}
      {fileSizeFormRow}
      {userNameFormRow}
      {hostNameFormRow}
      {c2MessageFormRow}
    </>
  ) : '';
  const serviceForm = iocType === 'service' ? (
    <>
      {timestampFormRow}
      {fileNameFormRow}
      {fileHashFormRow}
      {fileSizeFormRow}
      {userNameFormRow}
      {hostNameFormRow}
      {c2MessageFormRow}
    </>
  ) : '';
  const domainForm = iocType === 'domain' ? (
    <>
      {timestampFormRow}
      {userNameFormRow}
      {hostNameFormRow}
      {c2MessageFormRow}
      {domainNameFormRow}
    </>
  ) : '';

  return (
    <EuiForm
      component="form"
      onSubmit={handleFormSubmit}
    >
      <EuiFormRow
        label="IOC Type"
        helpText="Select the type of IOC to ingest."
      >
        <EuiSelect
          hasNoInitialSelection
          onChange={handleTypeChange}
          options={[
            {value: '', text: ''},
            {value: 'file', text: 'File'},
            {value: 'service', text: 'Service'},
            {value: 'domain', text: 'Domain'},
            // {value: 'ip', text: 'IP address'},
          ]}
        />
      </EuiFormRow>

      <EuiSpacer/>

      {fileForm}
      {serviceForm}
      {domainForm}

      <EuiButton type="submit" fill isDisabled={iocType === undefined}>
        Add IOC
      </EuiButton>
    </EuiForm>
  )
}
