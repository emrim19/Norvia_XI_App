// 1. Define the CSS Module structure once
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// 2. Define the API structure once (using the detailed version)
export interface IElectronAPI {
  selectFolder: () => Promise<any>;
  registerUser: (userData: any) => Promise<{ 
    success: boolean; 
    data?: any; 
    error?: string 
  }>;
  loginUser: (credentials: { email: string; password: string }) => Promise<{
      success: boolean;
      data?: {
        message: string;
        user: {
          id: string;
          name: string;
          email: string;
          created_at: string;
          last_login_at: string;
        };
      };
      error?: string;
    }>;
}

// 3. Inject it into the global Window object
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}