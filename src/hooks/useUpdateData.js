import { useState, useEffect } from 'react';
import {pfClient} from '@/pulseflowApiClient';

const useUpdateData = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const updateData = async (id, updatedData) => {
      setLoading(true);
      try {
        const response = await pfClient.put(id ? `${url}/${id}`: `${url}/`, updatedData);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    return { data, loading, error, updateData };
};

export default useUpdateData;