
export function authMiddleware(req, res, next) {
    if (req.path === '/login' || req.path === '/register') {
        return next();
    }

    next();
}
