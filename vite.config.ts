import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        devServer({
            entry: 'src/server/index.ts',
            exclude: [
                /^(?!\/api).+/, // Exclude anything that doesn't start with /api
                /.*\.css$/,
                /.*\.ts$/,
                /.*\.tsx$/,
                /^\/@.+$/,
                /\?t\=\d+$/,
                /^\/favicon\.ico$/,
                /^\/static\/.+$/,
                /^\/node_modules\/.+$/,
            ],
            injectClientScript: false,
        }),
    ],
})
