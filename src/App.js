import { useEffect, useState } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    /*
     * note that NODE_ENV defaults to
     * "development" when you run `npm/yarn start`
     * "production" when you run `npm/yarn build`
     */
    if (process.env.NODE_ENV === 'development') {
      setFirstEnvVariable(process.env.REACT_APP_FIRST_VARIABLE);
      setSecondEnvVariable(process.env.REACT_APP_SECOND_VARIABLE);
      return;
    }

    /*
     * the following function is supposed to execute when the NODE_ENV is not development, ideally production
     * you can also handle a case for a staging environment
     * what does it do?
     * calls a route and fetches the environment variables that are passed at run time to the docker container serving the application with NGINX
     * you can see the configuration of the route in the nginx.conf file
     */
    async function fetchSettings() {
      let response = await fetch('/appsettings/');
      let data = await response.json();
      setFirstEnvVariable(data.REACT_APP_FIRST_VARIABLE);
      setSecondEnvVariable(data.REACT_APP_SECOND_VARIABLE);
    }
    fetchSettings();
  }, []);

  const [firstEnvVariable, setFirstEnvVariable] = useState();
  const [secondEnvVariable, setSecondEnvVariable] = useState();
  return (
    <div className='App'>
      <header className='App-header'>
        <h4>NODE_ENV: {process.env.NODE_ENV}</h4>
        <h4>First Env Variable: {firstEnvVariable}</h4>
        <h4>Second Env Variable: {secondEnvVariable}</h4>
      </header>
    </div>
  );
}

export default App;
