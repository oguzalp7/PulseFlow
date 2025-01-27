import { useState, useEffect } from 'react';
import {pfClient} from '@/pulseflowApiClient';

const useDeleteData = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const deleteData = async (id) => {
      setLoading(true);
      try {
        const response = await pfClient.delete(`${url}/${id}`);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    return { data, loading, error, deleteData };
};

export default useDeleteData;