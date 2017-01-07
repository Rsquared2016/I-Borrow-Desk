import ReactGA from 'react-ga';
import analytics from 'redux-analytics';

ReactGA.initialize('UA-65249305-1', { debug: true});

const analyticsMiddleware = analytics(({ type, payload } ) =>
  ReactGA.event({
    category: 'User',
    action: type,
    label: payload
  }));

export { ReactGA, analyticsMiddleware };