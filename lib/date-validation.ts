/**
 * Date validation utility functions
 */

/**
 * Checks if checkout date is strictly greater than checkin date
 * @param checkInDate - Check-in date string (YYYY-MM-DD)
 * @param checkOutDate - Check-out date string (YYYY-MM-DD)
 * @returns Object with validation result and error message
 */
export const validateDates = (
  checkInDate: string,
  checkOutDate: string
): { isValid: boolean; errorMessage: string | null } => {
  // If either date is missing, return valid (let required field validation handle it)
  if (!checkInDate || !checkOutDate) {
    return { isValid: true, errorMessage: null };
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Reset time part to compare dates only
  checkIn.setHours(0, 0, 0, 0);
  checkOut.setHours(0, 0, 0, 0);

  if (checkOut <= checkIn) {
    return {
      isValid: false,
      errorMessage: "Check-out date must be after check-in date"
    };
  }

  return { isValid: true, errorMessage: null };
};

/**
 * Checks if a date is in the past
 * @param date - Date string (YYYY-MM-DD)
 * @returns boolean - true if date is in the past
 */
export const isDateInPast = (date: string): boolean => {
  if (!date) return false;
  
  const inputDate = new Date(date);
  const today = new Date();
  
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return inputDate < today;
};

/**
 * Gets minimum allowed date (tomorrow by default)
 * @param daysFromNow - Number of days from today (default: 1)
 * @returns Date string in YYYY-MM-DD format
 */
export const getMinDate = (daysFromNow: number = 1): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

/**
 * Gets minimum checkout date based on check-in date
 * @param checkInDate - Check-in date string (YYYY-MM-DD)
 * @returns Date string in YYYY-MM-DD format (check-in date + 1 day)
 */
export const getMinCheckoutDate = (checkInDate: string): string => {
  if (!checkInDate) return getMinDate(2); // Default to day after tomorrow
  
  const date = new Date(checkInDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

/**
 * Formats date for display
 * @param dateString - Date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "January 1, 2024")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * React hook for date validation in forms
 * @param initialCheckIn - Initial check-in date
 * @param initialCheckOut - Initial check-out date
 * @returns Object with date state and validation functions
 */
export const useDateValidation = (initialCheckIn: string = "", initialCheckOut: string = "") => {
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [dateError, setDateError] = useState<string | null>(null);

  // Validate dates whenever they change
  useEffect(() => {
    const { isValid, errorMessage } = validateDates(checkInDate, checkOutDate);
    setDateError(errorMessage);
  }, [checkInDate, checkOutDate]);

  const handleCheckInChange = (date: string) => {
    setCheckInDate(date);
    
    // If checkout date is before new check-in date, clear it
    if (checkOutDate && date) {
      const { isValid } = validateDates(date, checkOutDate);
      if (!isValid) {
        setCheckOutDate("");
      }
    }
  };

  const handleCheckOutChange = (date: string) => {
    setCheckOutDate(date);
  };

  return {
    checkInDate,
    checkOutDate,
    dateError,
    setCheckInDate: handleCheckInChange,
    setCheckOutDate: handleCheckOutChange,
    isValid: !dateError && checkInDate && checkOutDate,
    minCheckInDate: getMinDate(1), // Can't book for today
    minCheckOutDate: getMinCheckoutDate(checkInDate),
  };
};