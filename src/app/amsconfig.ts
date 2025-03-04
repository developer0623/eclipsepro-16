import { environment } from 'src/environments/environment';

export namespace Ams {
  //This gets set by the build environment. prod:`/`, dev:`http://test-eclipse.amscontrols.com:8080/`
  export let Config = {
    BASE_URL: environment.BASE_URL, // process.env.BASE_URL
  };
} //"http://test-eclipse.amscontrols.com:8080"
