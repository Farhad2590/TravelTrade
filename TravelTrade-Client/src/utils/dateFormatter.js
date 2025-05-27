/**
 * Formats a date string into a user-friendly format
 * @param {string} dateTimeStr - The date time string to format
 * @returns {string} Formatted date string
 */
export const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    
    try {
      const date = new Date(dateTimeStr);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date Error";
    }
  };
  
  /**
   * Calculates time difference between two dates in a human-readable format
   * @param {string} startDate - The start date string
   * @param {string} endDate - The end date string (defaults to current time)
   * @returns {string} Human-readable time difference
   */
  export const getTimeDifference = (startDate, endDate = new Date()) => {
    if (!startDate) return "N/A";
    
    try {
      const start = new Date(startDate);
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "Invalid Date";
      }
      
      const diffInMs = Math.abs(end - start);
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays > 30) {
        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
      } else if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHours > 0) {
          return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
          return diffInMinutes > 0 
            ? `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago` 
            : 'Just now';
        }
      }
    } catch (error) {
      console.error("Error calculating time difference:", error);
      return "Date Error";
    }
  };
  
  /**
   * Formats a date for input fields (YYYY-MM-DD)
   * @param {string|Date} date - The date to format
   * @returns {string} Date formatted as YYYY-MM-DD
   */
  export const formatDateForInput = (date) => {
    if (!date) return '';
    
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      
      // Check if date is valid
      if (isNaN(d.getTime())) {
        return '';
      }
      
      return d.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formatting date for input:", error);
      return '';
    }
  };