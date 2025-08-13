// themes/your-theme/vite.config.ts
import { defineConfig } from 'vite'
import { resolve, basename } from 'path'

const input = {
    main: resolve(__dirname, 'resources/js/main.js'),
    css: resolve(__dirname, 'resources/css/main.css'),
}

const themeName = 'sonarsystem'

export default defineConfig({
    base: `/themes/${themeName}/assets/build/`,
    build: {
        rollupOptions: { input },
        manifest: true,
        emptyOutDir: true,
        outDir: resolve(__dirname, 'assets/build'),
    },
    server: {
        hmr: {
            protocol: 'ws',
        },
        cors: {
            origin: true,
        },
    }
})
