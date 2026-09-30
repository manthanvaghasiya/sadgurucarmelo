/**
 * @file frontend/src/context/DealershipContactContext.jsx
 * @description Centralized reactive provider and hook for dealership contact info
 * (Full Name, Contact Phone, and Email Address) dynamically synchronized across the
 * entire website and admin panel.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';

const DealershipContactContext = createContext();

export const DEFAULT_DEALERSHIP_CONTACT = {
  name: 'Sadguru Admin',
  email: 'sadgurucarsurat@gmail.com',
  phone: '+91 98765 43210',
  address: 'Trilok Car Bazar, Simada Canal BRTS Rd, Canal Chokdi, Varachha, Surat, Gujarat 395013',
};

const STORAGE_KEY = 'dealership_contact';

/**
 * Normalizes phone numbers for wa.me links (digits only, e.g. 919876543210)
 */
export function getRawWhatsAppNumber(phoneStr) {
  if (!phoneStr) return '919876543210';
  const digits = String(phoneStr).replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/**
 * Normalizes phone for tel: links (e.g. +919876543210)
 */
export function getTelNumber(phoneStr) {
  if (!phoneStr) return '+919876543210';
  const clean = String(phoneStr).replace(/[^\d+]/g, '');
  if (!clean.startsWith('+')) {
    if (clean.length === 10) return `+91${clean}`;
    return `+${clean}`;
  }
  return clean;
}

export function DealershipContactProvider({ children }) {
  const [contact, setContact] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...DEFAULT_DEALERSHIP_CONTACT, ...parsed };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_DEALERSHIP_CONTACT;
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchContact = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/auth/contact-info');
      if (res.data?.success && res.data?.data) {
        const fresh = res.data.data;
        const merged = {
          name: fresh.name || DEFAULT_DEALERSHIP_CONTACT.name,
          email: fresh.email || DEFAULT_DEALERSHIP_CONTACT.email,
          phone: fresh.phone || DEFAULT_DEALERSHIP_CONTACT.phone,
          address: fresh.address || DEFAULT_DEALERSHIP_CONTACT.address,
        };
        setContact(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Using cached or default dealership contact info');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContact();

    const handleExternalUpdate = (event) => {
      if (event.detail) {
        setContact((prev) => {
          const updated = { ...prev, ...event.detail };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      } else {
        fetchContact();
      }
    };

    window.addEventListener('dealership_contact_updated', handleExternalUpdate);
    return () => {
      window.removeEventListener('dealership_contact_updated', handleExternalUpdate);
    };
  }, [fetchContact]);

  const updateContact = useCallback((newData) => {
    setContact((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('dealership_contact_updated', { detail: updated }));
      return updated;
    });
  }, []);

  const rawPhone = getRawWhatsAppNumber(contact.phone);
  const telPhone = getTelNumber(contact.phone);
  const displayPhone = contact.phone || DEFAULT_DEALERSHIP_CONTACT.phone;
  const displayEmail = contact.email || DEFAULT_DEALERSHIP_CONTACT.email;
  const displayName = contact.name || DEFAULT_DEALERSHIP_CONTACT.name;

  const getWhatsAppLink = useCallback(
    (message = '') => {
      const msg = message || `Hello ${displayName}, I would like to inquire about certified cars in Surat.`;
      return `https://wa.me/${rawPhone}?text=${encodeURIComponent(msg)}`;
    },
    [displayName, rawPhone]
  );

  const value = {
    contact,
    name: displayName,
    email: displayEmail,
    phone: displayPhone,
    rawPhone,
    telPhone,
    telLink: `tel:${telPhone}`,
    mailLink: `mailto:${displayEmail}`,
    address: contact.address || DEFAULT_DEALERSHIP_CONTACT.address,
    isLoading,
    getWhatsAppLink,
    updateContact,
    refetchContact: fetchContact,
  };

  return (
    <DealershipContactContext.Provider value={value}>
      {children}
    </DealershipContactContext.Provider>
  );
}

export function useDealershipContact() {
  const ctx = useContext(DealershipContactContext);
  if (!ctx) {
    // Graceful fallback if outside provider
    const fallbackRaw = getRawWhatsAppNumber(DEFAULT_DEALERSHIP_CONTACT.phone);
    const fallbackTel = getTelNumber(DEFAULT_DEALERSHIP_CONTACT.phone);
    return {
      contact: DEFAULT_DEALERSHIP_CONTACT,
      name: DEFAULT_DEALERSHIP_CONTACT.name,
      email: DEFAULT_DEALERSHIP_CONTACT.email,
      phone: DEFAULT_DEALERSHIP_CONTACT.phone,
      rawPhone: fallbackRaw,
      telPhone: fallbackTel,
      telLink: `tel:${fallbackTel}`,
      mailLink: `mailto:${DEFAULT_DEALERSHIP_CONTACT.email}`,
      address: DEFAULT_DEALERSHIP_CONTACT.address,
      isLoading: false,
      getWhatsAppLink: (msg) => `https://wa.me/${fallbackRaw}?text=${encodeURIComponent(msg || '')}`,
      updateContact: () => {},
      refetchContact: () => {},
    };
  }
  return ctx;
}

export default DealershipContactContext;
