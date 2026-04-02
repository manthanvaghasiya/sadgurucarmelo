import { createContext, useContext, useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const CarContext = createContext();

export function CarProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/cars');
      setCars(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch cars');
    } finally {
      setIsLoading(false);
    }
  };

  const addCar = async (carData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/cars', carData);
      const newCar = response.data.data || response.data;
      setCars((prev) => [newCar, ...prev]);
      return newCar;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add car');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCar = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/cars/${id}`);
      setCars((prev) => prev.filter((car) => (car._id || car.id) !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete car');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CarContext.Provider value={{ cars, isLoading, error, fetchCars, addCar, deleteCar }}>
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
