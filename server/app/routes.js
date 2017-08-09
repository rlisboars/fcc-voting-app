var User = require('../app/models/user');
var { Pool, Option } = require('../app/models/pool');

module.exports = function(app, passport) {

    // User access routes

    app.post('/api/login', (req, res) => {
        if (!req.body.email || !req.body.password) { 
            res.status(401).json({ error: 'Missing data on request' });
        } else {
            User.login(req.body.email, req.body.password, (success, result) => {
                if (!success) {
                    res.status(403).json(result);
                } else res.status(200).json(result);
            });
        }
    });

    app.post('/api/signup', (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.status(400).json({ error: 'Missing data on request' });
        } else {
            User.signup(req.body.email, req.body.password, (success, result) => {
                if (!success) {
                    res.status(500).json(result);
                } else res.status(200).json(result);
            });
        }
        
    });

    app.get('/api/validate', (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) { return next(err) }
            if (!user) { return res.status(403).end() }
            return res.status(200).json({ 'authorized': true });
        })(req, res, next);
    });

    // Pool routes
    app.post('/api/create', passport.authenticate('jwt', { session: false }), (req, res) => {
        if (!req.user || !req.body.pool || !req.body.options) {
            res.status(400).json({ error: 'Missing data on request' });
        } else {
            Pool.create(req.user, req.body.pool, req.body.options, (success, result) => {
                if (!success) {
                    res.status(500).json({ error: result });
                } else {
                    res.status(200).json(result);
                }
            });
        }

    });

    app.post('/api/pool/:pool_id/add', (req, res) => {
        if (!req.body.option) {
            res.status(400).json({ error: 'Missing data on request' });
        } else {
            var userId = req.body.user ? req.body.user : null;
            Pool.addOption(req.params.pool_id, req.body.option, userId, (success, result) => {
                if (!success) {
                    res.status(500).json({ error: result });
                } else {
                    res.status(200).json(result);
                }
            })
        }
    });

    app.get('/api/vote', (req, res) => {
        if (!req.query.pool || !req.query.option) {
            res.status(400).json({ error: 'Missing data on request' });
        } else {
            Pool.vote(req.query.pool, req.query.option, (success, result) => {
                if (!success) {
                    res.status(500).json({ error: result });
                } else {
                    res.status(200).json(result);
                }
            });
        }
    });

    app.get('/api/pool/:pool_id', (req, res) => {
        const poolId = req.params.pool_id;
        Pool.findById(poolId, (err, pool) => {
            if (err) {
                return res.status(500).json({ error: err });
            } else {
                return res.status(200).json(pool);
            }
        });
    });

    app.delete('/api/pool/:pool_id', passport.authenticate('jwt', { session: false }), (req, res) => {
        if (!req.body.option) {
            Pool.removeById(req.params.pool_id, (success, result) => {
                if (!success) {
                    res.status(500).json({ error: result });
                } else {
                    res.status(200).json(result);
                }
            });
        } else {
            Pool.removeOption(req.params.pool_id, req.body.option, (success, result) => {
                if (!success) {
                    res.status(500).json({ error: result });
                } else {
                    res.status(200).json(result);
                }
            });
        }  
    });

    app.get('/api/pools/', (req, res) => {
        Pool.list(req.query.page, req.query.items, req.query.user, (success, result) => {
            if (!success) {
                res.status(500).json({ error: result });
            } else {
                res.status(200).json(result);
            }
        });
    });

};

function generateToken(email) {
    var payload = { email };
    var token = jwt.sign(payload, process.env.SECRET);
    return token;
}