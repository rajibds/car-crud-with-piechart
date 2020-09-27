import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import httpClient from '../../libraries/httpClient';

const UploadCSV = ({ fetchCars }) => {
  const [selectedCSV, setSelectedCSV] = useState(null);
  const [CSVUploadComplete, setCSVUploadComplete] = useState(false);
  const [CSVUploadErrors, setCSVUploadErrors] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCSVUploadComplete(false);
      setCSVUploadErrors([]);
    }, 5000);
    return () => clearTimeout(timer);
  }, [CSVUploadErrors]);

  const handleSubmitCSV = async event => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('file', selectedCSV);

      const { data } = await httpClient.post('/cars/import', formData);
      if (data.error === null) {
        setSelectedCSV(null);
        setCSVUploadComplete(true);
        setCSVUploadErrors([]);
        fetchCars();
      }
    } catch (error) {
      const response = error.response;
      if (response && response.status === 422) {
        setSelectedCSV(null);
        setCSVUploadComplete(true);
        setCSVUploadErrors(response.data.error);
      }
    }
  };

  return (
    <form onSubmit={event => handleSubmitCSV(event)} className="csv-upload-form">
      <input type="file" accept=".csv" onChange={event => setSelectedCSV(event.target.files[0])} />

      <span>
        <input type="submit" value="Upload" disabled={!selectedCSV} />
      </span>

      {CSVUploadComplete && CSVUploadErrors.length === 0 && (
        <div className="csv-upload-form__successful">CSV Upload Successful</div>
      )}
      {CSVUploadComplete && CSVUploadErrors.length > 0 && (
        <div className="csv-upload-form__unsuccessful">CSV Upload Unsuccessful</div>
      )}
    </form>
  );
};

UploadCSV.propTypes = {
  fetchCars: PropTypes.func.isRequired,
};

export default UploadCSV;
