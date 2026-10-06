import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';

const CarContext = createContext();

export function CarProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch all cars from the backend ──
  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/cars?limit=1000');
      const carList = Array.isArray(response.data?.data)
        ? response.data.data
        : (Array.isArray(response.data) ? response.data : []);
      setCars(carList);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch cars');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Auto-fetch on mount ──
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // ── Add a new car and prepend to state instantly ──
  const addCar = async (carData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/cars', carData);
      const newCar = response.data.data || response.data;
      setCars((prevCars) => [newCar, ...prevCars]);
      return newCar;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add car');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update a car and replace it in state instantly ──
  const updateCar = async (id, carData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/cars/${id}`, carData);
      const updatedCar = response.data.data || response.data;
      setCars((prevCars) =>
        prevCars.map((car) => ((car._id || car.id) === id ? updatedCar : car))
      );
      return updatedCar;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update car');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Delete a car and filter it out of state instantly ──
  const deleteCar = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/cars/${id}`);
      setCars((prevCars) => prevCars.filter((car) => (car._id || car.id) !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete car');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Toggle Featured Status (Home Page) ──
  const toggleFeatured = async (id) => {
    // Optimistic UI update
    setCars((prevCars) =>
      prevCars.map((car) =>
        (car._id || car.id) === id
          ? { ...car, isFeaturedOnHome: !car.isFeaturedOnHome }
          : car
      )
    );

    try {
      await axiosInstance.patch(`/cars/${id}/toggle-featured`);
    } catch (err) {
      // Revert on error
      setCars((prevCars) =>
        prevCars.map((car) =>
          (car._id || car.id) === id
            ? { ...car, isFeaturedOnHome: !car.isFeaturedOnHome }
            : car
        )
      );
      setError(err.response?.data?.message || err.message || 'Failed to toggle featured status');
      throw err;
    }
  };

  // ── Mark Car As Sold (Starts 24h grace period or purges immediately) ──
  const markCarAsSold = async (id, options = {}) => {
    // Optimistic UI update
    setCars((prevCars) =>
      prevCars.map((car) =>
        (car._id || car.id) === id
          ? { ...car, status: 'Sold', soldAt: new Date().toISOString(), photosPurged: options.purgeImmediately || false }
          : car
      )
    );

    try {
      const response = await axiosInstance.post(`/cars/${id}/mark-sold`, options);
      const updatedCar = response.data?.data;
      if (updatedCar) {
        setCars((prevCars) =>
          prevCars.map((car) => ((car._id || car.id) === id ? updatedCar : car))
        );
      }
      return response.data;
    } catch (err) {
      fetchCars();
      throw err;
    }
  };

  // ── Revert Car Sold status back to Available ──
  const revertCarSold = async (id) => {
    setCars((prevCars) =>
      prevCars.map((car) =>
        (car._id || car.id) === id
          ? { ...car, status: 'Available', soldAt: null }
          : car
      )
    );

    try {
      const response = await axiosInstance.post(`/cars/${id}/revert-sold`);
      const updatedCar = response.data?.data;
      if (updatedCar) {
        setCars((prevCars) =>
          prevCars.map((car) => ((car._id || car.id) === id ? updatedCar : car))
        );
      }
      return response.data;
    } catch (err) {
      fetchCars();
      throw err;
    }
  };

  // ── Manually Purge Extra Photos Now (Bypass 24h timer) ──
  const purgeCarPhotos = async (id) => {
    try {
      const response = await axiosInstance.post(`/cars/${id}/purge-photos`);
      const updatedCar = response.data?.data;
      if (updatedCar) {
        setCars((prevCars) =>
          prevCars.map((car) => ((car._id || car.id) === id ? updatedCar : car))
        );
      }
      return response.data;
    } catch (err) {
      fetchCars();
      throw err;
    }
  };

  return (
    <CarContext.Provider value={{
      cars,
      isLoading,
      error,
      fetchCars,
      addCar,
      updateCar,
      deleteCar,
      toggleFeatured,
      markCarAsSold,
      revertCarSold,
      purgeCarPhotos,
    }}>
      {children}
    </CarContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a <CarProvider>');
  }
  return context;
}
