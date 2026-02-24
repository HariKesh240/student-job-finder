import React, { createContext, useState, useCallback } from 'react';
import API from '../api/axiosConfig';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await API.get('/getjobs');
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  }, []); // Memoized function

  const fetchApplications = useCallback(async () => {
    try {
      const res = await API.get('/getapplications');
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
    }
  }, []); // Memoized function

  return (
    <DataContext.Provider value={{ jobs, applications, fetchJobs, fetchApplications }}>
      {children}
    </DataContext.Provider>
  );
};