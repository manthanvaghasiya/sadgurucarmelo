/**
 * @file frontend/src/services/customerService.js
 * @description Domain and Network service layer responsible for customer testimonial
 * fetching, schema validation, and pure fallback normalization.
 */

// External dependencies
import axiosInstance from '../api/axiosConfig';

// Internal local imports
import { FALLBACK_HERO_CUSTOMERS } from '../data/aboutData';

/**
 * @typedef {Object} CustomerRecord
 * @property {string} _id - Unique customer record identifier
 * @property {string} customerName - Customer full name and location tag
 * @property {string} carModel - Model of car delivered
 * @property {string} deliveryTag - Marketing delivery badge label
 * @property {string} rating - Numerical star rating string
 * @property {string} location - City or regional locality
 * @property {string} photo - Cloudinary or local image asset URL
 * @property {string} reviewText - Customer satisfaction testimonial text
 */

/**
 * Custom error class for customer data retrieval failures
 */
export class CustomerServiceError extends Error {
  /**
   * @param {string} message - Error description
   * @param {unknown} [cause] - Underlying error trigger
   */
  constructor(message, cause) {
    super(message);
    this.name = 'CustomerServiceError';
    this.cause = cause;
  }
}

/**
 * CustomerService API & Domain Adapter
 */
export const CustomerService = {
  /**
   * Fetches customer delivery records from the backend and blends with verified fallback assets
   * @param {CustomerRecord[]} [fallbackData=FALLBACK_HERO_CUSTOMERS] - Base verified customer records
   * @returns {Promise<CustomerRecord[]>} Complete normalized list of customer delivery records
   * @throws {CustomerServiceError} Wrapped domain error on non-recoverable operational failures
   */
  async getHeroCustomers(fallbackData = FALLBACK_HERO_CUSTOMERS) {
    try {
      const response = await axiosInstance.get('/happy-customers');
      const rawData = response.data?.data;

      if (isNonEmptyArray(rawData)) {
        return mergeCustomerData(rawData, fallbackData);
      }

      return fallbackData;
    } catch (error) {
      // Gracefully log warning and recover with fallback data to preserve UX resilience
      console.warn('CustomerService: Non-blocking fetch issue, falling back to static cache:', error);
      return fallbackData;
    }
  },

  /**
   * Pure domain function to merge remote API records with existing verified fallback records
   * @param {Array<Partial<CustomerRecord>>} apiList - Raw records from API
   * @param {CustomerRecord[]} fallbackList - Local fallback records
   * @returns {CustomerRecord[]} Deterministic normalized customer array
   */
  mergeCustomerData,
};

// ─────────────────────────────────────────────────────────────────────────────
// Pure Domain Helper Functions & Predicates
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pure predicate verifying whether an unknown value is a non-empty array
 * @param {unknown} value
 * @returns {boolean} True if array has at least 1 element
 */
function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Merges raw API records into the fixed showcase slots
 * @param {Array<Partial<CustomerRecord>>} apiList - Remote customer list
 * @param {CustomerRecord[]} fallbackList - Guaranteed static list
 * @returns {CustomerRecord[]} Cleanly populated customer list
 */
function mergeCustomerData(apiList, fallbackList) {
  return fallbackList.map((fallbackRecord, index) => {
    const apiMatch = apiList[index];
    if (!apiMatch) {
      return fallbackRecord;
    }

    return {
      ...fallbackRecord,
      _id: apiMatch._id || fallbackRecord._id,
      customerName: apiMatch.customerName || fallbackRecord.customerName,
      photo: apiMatch.photo || fallbackRecord.photo,
      reviewText: apiMatch.reviewText || fallbackRecord.reviewText,
    };
  });
}

export default CustomerService;
