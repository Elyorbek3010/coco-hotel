import { useState, useEffect } from 'react';
import { getHotelInformation } from '../api/hotel';
import { HotelContext } from './hotelContextDef';

export default function HotelProvider({ children }) {
  const [hotelInfo, setHotelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getHotelInformation()
      .then((data) => {
        if (isMounted) {
          setHotelInfo(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <HotelContext.Provider value={{ hotelInfo, loading, error }}>
      {children}
    </HotelContext.Provider>
  );
}
