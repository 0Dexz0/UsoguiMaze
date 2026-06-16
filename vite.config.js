import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import devtools from 'solid-devtools/vite'
import solidStyled from 'vite-plugin-solid-styled'
import path from 'path'

export default defineConfig({
    plugins: [devtools(), solidPlugin(), solidStyled()],
    server: {
        port: 3000,
    },
    base: '/UsoguiMaze/',
    build: {
        target: 'esnext',
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
        },
    },
})
