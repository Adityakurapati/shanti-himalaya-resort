import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your Google Analytics ID

export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }
};

export const logPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    ReactGA.send({ hitType: 'pageview', page: url });
  }
};

export const logEvent = (category: string, action: string, label?: string) => {
  if (typeof window !== 'undefined') {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};