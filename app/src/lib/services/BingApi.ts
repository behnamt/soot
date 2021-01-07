export interface MapWindow extends Window {
  GetMap: () => void;
  Microsoft: any;
}

declare let window: MapWindow;
export let Microsoft: any;

export function loadBingApi(key?: string): Promise<void> {
  let url = `http://www.bing.com/api/maps/mapcontrol?callback=GetMap&&key=${process.env.REACT_APP_BING_API_KEY}`;
  if (key) {
    url += `&key=${key}`;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = url;
    window.GetMap = (): void => {
      Microsoft = window.Microsoft;
      resolve();
    };
    script.onerror = (error: Event | string): void => {
      reject(error);
    };
    document.body.appendChild(script);
  });
}
