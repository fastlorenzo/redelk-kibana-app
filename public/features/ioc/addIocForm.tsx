import React, {ChangeEvent, useState} from 'react';
import {useDispatch} from 'react-redux';
import moment, {Moment} from 'moment';

import {
  EuiButton,
  EuiDatePicker,
  EuiDescribedFormGroup,
  EuiFieldNumber,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
} from '@elastic/eui';

import {CoreStart} from 'kibana/public';

import {createIOC} from './iocSlice'
import {CreateIOCType} from "./types";

interface AddIOCFormDeps {
  http: CoreStart['http'];
}

export const AddIOCForm = ({http}: AddIOCFormDeps) => {

  const md5Regexp: RegExp = /^[a-fA-F0-9]{32}$/;

  const dispatch = useDispatch();

  const [type, setType] = useState<string>('');
  const [timestamp, setTimestamp] = useState<Moment>(moment());
  const [fileName, setFileName] = useState<string>('');
  const [fileHash, setFileHash] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');

  const fileHashErrors: string[] = ['Invalid file hash'];
  const isFileHashValid: boolean = md5Regexp.test(fileHash);

  const isFileNameValid: boolean = typeof fileName === 'string' && fileName.length > 0;
  const fileNameErrors: string[] = [!isFileNameValid ? 'File name is required' : '']

  const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    const payload: CreateIOCType = {
      '@timestamp': timestamp.toISOString(),
      ioc: {
        type: type
      },
      file: {
        name: fileName,
        size: fileSize,
        hash: {
          md5: fileHash
        }
      }
    };
    dispatch(createIOC({http, payload}));
    e.preventDefault();
  }

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  }
  // File
  const handleFileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  }
  const handleFileHashChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileHash(e.target.value);
  }
  const handleFileSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileSize(e.target.value);
  }
  const handleTimestampChange = (date: Moment) => {
    setTimestamp(date);
  }

  const fileForm = type === 'file' ? (
    <>
      <EuiDescribedFormGroup
        title={<h3>Timestamp <em>(required)</em></h3>}
        description={<>When has the IOC been seen?</>}
      >
        <EuiFormRow
          label="Time select on"
        >
          <EuiDatePicker
            showTimeSelect
            selected={timestamp}
            onChange={handleTimestampChange}
            timeIntervals={1}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>File name <em>(required)</em></h3>}
        description={<>Name of the file related to the IOC.</>}
      >
        <EuiFormRow
          label="File name"
          error={fileNameErrors}
          isInvalid={!isFileNameValid}
        >
          <EuiFieldText
            name="fileName"
            onChange={handleFileNameChange}
            isInvalid={!isFileNameValid}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      <EuiDescribedFormGroup
        title={<h3>File hash <em>(required)</em></h3>}
        description={<>MD5 hash of the file related to the IOC.</>}
      >
        <EuiFormRow
          label="File hash (MD5)"
          error={fileHashErrors}
          isInvalid={!isFileHashValid}
        >
          <EuiFieldText
            name="fileHash"
            onChange={handleFileHashChange}
            isInvalid={!isFileHashValid}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      <EuiDescribedFormGroup
        title={<h3>File size</h3>}
        description={<>Size of the file related to the IOC (in bytes).</>}
      >
        <EuiFormRow
          label="File size"
        >
          <EuiFieldNumber
            name="fileSize"
            onChange={handleFileSizeChange}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
    </>
  ) : ''

  return (
    <EuiForm
      component="form"
      onSubmit={handleFormSubmit}
    >
      <EuiDescribedFormGroup
        title={<h3>IOC type</h3>}
        description={<>Select the type of IOC to ingest.</>}
      >
        <EuiFormRow
          label="IOC Type"
        >
          <EuiSelect
            hasNoInitialSelection
            onChange={handleTypeChange}
            options={[
              {value: 'file', text: 'File'},
              {value: 'service', text: 'Service'},
              {value: 'domain', text: 'Domain'},
              {value: 'ip', text: 'IP address'},
            ]}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>

      <EuiSpacer/>

      {fileForm}

      <EuiButton type="submit" fill isDisabled={type === undefined}>
        Add IOC
      </EuiButton>
    </EuiForm>
  )
}
