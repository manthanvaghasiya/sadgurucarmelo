/**
 * @file frontend/src/hooks/useSellCarForm.js
 * @description Custom hook encapsulating state management, client-side image compression,
 * form validation, and network communication for vehicle selling requests.
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import axiosInstance from '../api/axiosConfig';

const INITIAL_FORM_STATE = {
  ownerName: '',
  phone: '',
  email: '',
  carBrand: '',
  carModel: '',
  year: new Date().getFullYear() - 3,
  kmDriven: '',
  fuelType: 'Petrol',
  transmission: 'Manual',
  expectedPrice: '',
  notes: '',
};

export default function useSellCarForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandSelect = (brand) => {
    setFormData((prev) => ({ ...prev, carBrand: brand }));
  };

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 10) {
      toast.error('મહત્તમ 10 ફોટા અપલોડ કરી શકાય છે (Max 10 photos)');
      return;
    }

    setCompressing(true);
    const toastId = toast.loading('ફોટા કમ્પ્રેસ અને ઓપ્ટિમાઇઝ થઈ રહ્યા છે...');

    try {
      const compressedFiles = [];
      const newPreviews = [];

      for (const file of files) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
        };
        const compressed = await imageCompression(file, options);
        compressedFiles.push(compressed);
        newPreviews.push(URL.createObjectURL(compressed));
      }

      setPhotos((prev) => [...prev, ...compressedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
      toast.success('ફોટા સફળતાપૂર્વક ઉમેરાયા!', { id: toastId });
    } catch (err) {
      console.error('Photo compression error:', err);
      toast.error('ફોટા પ્રોસેસ કરવામાં ક્ષતિ થઈ', { id: toastId });
    } finally {
      setCompressing(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.ownerName.trim()) {
      toast.error('કૃપા કરીને તમારું નામ દાખલ કરો');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error('કૃપા કરીને માન્ય 10-અંકનો મોબાઈલ નંબર દાખલ કરો');
      return;
    }
    if (!formData.carBrand.trim()) {
      toast.error('કૃપા કરીને કારની બ્રાન્ડ પસંદ કરો');
      return;
    }
    if (!formData.carModel.trim()) {
      toast.error('કૃપા કરીને કારનું મોડેલ દાખલ કરો');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('તમારી કારની વિગતો સબમિટ થઈ રહી છે...');

    try {
      const data = new FormData();
      data.append('ownerName', formData.ownerName.trim());
      data.append('phone', cleanPhone);
      if (formData.email) data.append('email', formData.email.trim());
      data.append('carBrand', formData.carBrand.trim());
      data.append('carModel', formData.carModel.trim());
      if (formData.year) data.append('year', formData.year);
      if (formData.kmDriven) data.append('kmDriven', formData.kmDriven);
      data.append('fuelType', formData.fuelType);
      data.append('transmission', formData.transmission);
      if (formData.expectedPrice) data.append('expectedPrice', formData.expectedPrice);
      if (formData.notes) data.append('notes', formData.notes.trim());

      if (photos.length > 0) {
        const compressOptions = {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };
        const compressedPhotos = await Promise.all(
          photos.map(async (photo) => {
            try {
              return await imageCompression(photo, compressOptions);
            } catch (err) {
              console.warn('Sell car photo compression fallback:', err);
              return photo;
            }
          })
        );
        compressedPhotos.forEach((photo) => {
          data.append('photos', photo);
        });
      }

      const res = await axiosInstance.post('/sell-requests', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setIsSuccess(true);
        toast.success('તમારી વિગતો સફળતાપૂર્વક મળી ગઈ છે!', { id: toastId });
      } else {
        toast.error(res.data.message || 'સબમિશન નિષ્ફળ ગયું', { id: toastId });
      }
    } catch (err) {
      console.error('Sell car submission error:', err);
      toast.error(
        err.response?.data?.message || 'વિનંતી મોકલવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.',
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormData(INITIAL_FORM_STATE);
    setPhotos([]);
    setPreviews([]);
    setActiveStep(1);
  };

  return {
    formData,
    setFormData,
    photos,
    previews,
    isSubmitting,
    isSuccess,
    compressing,
    activeStep,
    setActiveStep,
    handleInputChange,
    handleBrandSelect,
    handlePhotoSelect,
    removePhoto,
    handleSubmit,
    resetForm,
  };
}
