var mongoose = require('mongoose');

var optionSchema = new mongoose.Schema({
    option: {
        type: String,
        require: true
    },
    user: {
        _id: {
            type: mongoose.Schema.ObjectId
        },
        name: {
            type: String
        }
    },
    votes: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

var poolSchema = mongoose.Schema({
    user: {
        _id: {
            type: mongoose.Schema.ObjectId
        },
        name: {
            type: String
        }
    },
    pool: {
        type: String,
        require: true
    }, 
    votes: {
        type: Number,
        default: 0
    },
    options: [optionSchema],  
},
{
    timestamps: true
});

poolSchema.statics.create = function(user, pool, options, callback) {
    var Option = this.model('Option');
    var Pool = this.model('Pool');
    options = options.map(opt => new Option(opt));
    var newPool = new Pool();
    newPool.user = {
        _id: user._id,
        name: user.email
    };
    newPool.pool = pool;
    newPool.options = options;
    newPool.save(err => {
        if (err) {
            return callback(false, { error: err });
        } else {
            return callback(true, newPool._id);
        }
    });
}

poolSchema.statics.vote = function(poolId, optionId, callback) {
    var Option = this.model('Option');
    var Pool = this.model('Pool');
    Pool.findById(poolId, (err, pool) => {
        if (err) {
            return callback(false, err);
        } else {
            var opt = pool.options.id(optionId);
            if (!opt) return callback(false, { error: 'Invalid option' });
            opt.votes += 1;
            pool.votes += 1;
            pool.save(err => {
                if (err) {
                    return callback(false, { error: err });
                } else {
                    return callback(true, pool.votes);
                }
            });
        }
    });
}

poolSchema.statics.addOption = function(poolId, option, userId, callback) {
    var Option = this.model('Option');
    var Pool = this.model('Pool');
    Pool.findById(poolId, (err, pool) => {
        if (err) {
            return callback(false, err);
        } else {
            var opt = new Option();
            opt.option = option;
            if (userId) opt.user = userId;
            pool.options.push(opt);
            pool.save(err => {
                if (err) {
                    return callback(false, { error: err });
                } else {
                    return callback(true, opt._id);
                }
            })
        }
    })
}

poolSchema.statics.removeById = function(poolId, callback) {
    var Pool = this.model('Pool');
    Pool.findByIdAndRemove(poolId, (err, pool) => {
        if (err) {
            return callback(false, err);
        } else {
            return callback(true, pool._id);
        }
    });
}

poolSchema.statics.removeOption = function(poolId, optionId, callback) {
    var Pool = this.model('Pool');
    Pool.findById(poolId, (err, pool) => {
        if (err) return callback(false, err);
        if (!pool) return callback(false, { error: 'Pool not found!' });
        var opt = pool.options.id(optionId);
        if (!opt) return callback(false, { error: 'Invalid option' });
        if (opt) {
            pool.votes -= opt.votes;
            opt.remove();
            pool.save(err => {
                if (err) return callback(false, err);
                return callback(true, opt._id);
            });
        }
    });
}

poolSchema.statics.list = function(page, items, userId, callback) {
    var Pool = this.model('Pool');
    var query = userId ? { user: userId } : {};
    var options = page ? { skip: (page-1)*items, limit: +items } : {};
    Pool.find(query, {}, options).exec((err, pools) => {
        if (err) return callback(false, err);
        return callback(true, {
            total: pools.length,
            pools
        });
    });
}

module.exports = {
    Pool: mongoose.model('Pool', poolSchema),
    Option: mongoose.model('Option', optionSchema)
}