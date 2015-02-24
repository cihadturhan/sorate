(function() {

    var query = {};

    var ops = [];
    var specs = {
        match_all: '',
        _all: ["query_string"],
        string: ["term", "wildcard", "prefix", "fuzzy", "range", "query_string", "text"],
        long: ["term", "range", "fuzzy", "query_string"],
        integer: ["term", "range", "fuzzy", "query_string"],
        float: ["term", "range", "fuzzy", "query_string"],
        byte: ["term", "range", "fuzzy", "query_string"],
        short: ["term", "range", "fuzzy", "query_string"],
        double: ["term", "range", "fuzzy", "query_string"],
        date: ["term", "range", "fuzzy", "query_string"],
        ip: ["term", "range", "fuzzy", "query_string"]
    };

    if (spec.type === 'match_all') {
    } else if (spec.type === '_all') {
        ops = ["query_string"];
    } else if (spec.type === 'string') {
        ops = ["term", "wildcard", "prefix", "fuzzy", "range", "query_string", "text"];
    } else if (spec.type === 'long' || spec.type === 'integer' || spec.type === 'float' ||
            spec.type === 'byte' || spec.type === 'short' || spec.type === 'double') {
        ops = ["term", "range", "fuzzy", "query_string"];
    } else if (spec.type === 'date') {
        ops = ["term", "range", "fuzzy", "query_string"];
    } else if (spec.type === 'ip') {
        ops = ["term", "range", "fuzzy", "query_string"];
    }


    var availables = {
        name: 'all',
        children: [
            {
                name: 'facebook',
                children:
                        [
                            {
                                name: 'content',
                                type: 'string'
                            },
                            {
                                name: 'created_at',
                                type: 'date'
                            },
                            {
                                name: 'links',
                                type: 'string'
                            }
                        ]
            }, {
                name: 'twitter',
                children:
                        [
                            {
                                name: 'content',
                                type: 'string'
                            },
                            {
                                name: 'created_at',
                                type: 'date'
                            },
                            {
                                name: 'device',
                                type: 'string'
                            },
                            {
                                name: 'id', //tweet id
                                type: 'long'
                            },
                            {
                                name: 'retweet_id',
                                type: 'long'
                            },
                            {
                                name: 'links',
                                type: 'string'
                            },
                            {
                                name: 'deleted',
                                type: 'integer'
                            },
                            {
                                name: 'lattitude',
                                type: 'float'
                            },
                            {
                                name: 'longitude',
                                type: 'float'
                            }, {
                                name: 'media',
                                type: 'string'
                            }, {
                                name: 'isSpam',
                                type: 'integer'
                            }
                        ]
            }]
    };


    var allQuery = {
        query: [{
                boolType: 'must',
                field: 'created_at',
                operation: 'range',
                lowOperation: 'from',
                highOperation: 'to',
                lowValue: current().subtract('days', 1).format('YYYY-MM-DDTHH:mm:ss.000Z'),
                highValue: current().format('YYYY-MM-DDTHH:mm:ss.000Z')
            },
            {
                boolType: 'must',
                field: 'is_spam',
                operation: 'term',
                value: '0'
            }

        ],
        facetSize: 30,
        starttime: current().subtract('days', 1).format('YYYY-MM-DD HH:mm:ss'),
        endtime: current().format('YYYY-MM-DD HH:mm:ss'),
        mod: 'spamfilter'
    };
})();