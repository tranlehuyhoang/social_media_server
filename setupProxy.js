import { createProxyMiddleware } from 'http-proxy-middleware';

const proxyConfig = {
    target: 'http://localhost:3000',
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['x-frame-options'] = '';
    }
};

const configureProxy = (app) => {
    app.use('/api', createProxyMiddleware(proxyConfig));
};

export default configureProxy;