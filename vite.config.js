import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({command, mode, ssrBuild}) => { 
  if (mode == 'production')  {
    return {
      plugins: [react()],
      base:'/paypre/',
      envDir:'src',
      envPrefix:'ENV_',
    }
  } else {
    return {
      plugins: [react()],
      envDir:'src',
      envPrefix:'ENV_',
      
      server: {
            host: '192.168.1.39',
            port: process.env.PORT || 3000,
          },
    }
  }
  
}
  
)

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '192.168.1.17',
//     port: process.env.PORT || 3000,
//   },
// });
