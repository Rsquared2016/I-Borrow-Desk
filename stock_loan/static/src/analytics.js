import ReactGA from 'react-ga';
import analytics from 'redux-analytics';

ReactGA.initialize(analyticsID, { debug: analyticsDebug });

const analyticsMiddleware = analytics(({ type, payload } ) =>
  ReactGA.event({
    category: 'User',
    action: type,
    label: payload
  }));

export { ReactGA, analyticsMiddleware };