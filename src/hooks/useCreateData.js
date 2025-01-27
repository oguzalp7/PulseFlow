import { useState, useEffect } from 'react';
import {pfClient} from '@/pulseflowApiClient';

const useCreateData = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const createData = async (newData) => {
      setLoading(true);
      try {
        const response = await pfClient.post(url, newData);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    return { data, loading, error, createData };
};
  
export default useCreateData;