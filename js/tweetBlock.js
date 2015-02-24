
// Dynamic tweet text generator functions

createFullTweetBlock = function(data, keylist, timeformat) {
    return $('<li>').append(createTweetContent(data, keylist, timeformat)).attr('data-id', data.tweetId);
};

createTweetContent = function(data, keylist, timeformat) {
    var content = $('<div>').addClass('content');
    var tweetText = createTweetText(data);
    var retweet = createRetweet(data);
    // keys must be array
    var keys = typeof keylist === 'string' ? JSON.parse(keylist) : keylist;
    //keys.arrTr2eng();
    //tweetText.highlight(keys, {element: 'span', className: 'emphasized', wordsOnly: true});
    if (keys.length > 0) {
        var keys = keys.join('|');
        keys = keys.replace('ü', '(u|ü|Ü)').replace('ç', '(c|ç|Ç)').replace('ğ', '(g|ğ|Ğ)').replace('ı', '(ı|i|İ)').replace('ö', '(o|ö|Ö)').replace('ş', '(s|ş|Ş)');
        var regex = new RegExp(keys, 'ig');
        tweetText.highlightRegex(regex, {tagType: 'span', className: 'emphasized'});
    }
    content.append(createStreamItemHeader(data, timeformat))
            .append(tweetText).append(retweet);
    return content;
};

createRetweet = function(data) {
    if (!data.count)
        return false;
    return $('<span>').addClass('retweets').html(data.count);
};

createTweetText = function(data) {
    var href = 'https://twitter.com/' + data.userName + '/status/' + data.tweetId;
    return $('<a>').attr({href: href, target: '_blank'}).addClass('js-tweet-text').html(data.tweetText);
};

createStreamItemHeader = function(data, timeformat) {
    var timeFormat = timeformat ? timeformat : "HH:mm:ss";
    var avatar_src = data.userProfileImage;
    var user_link = "http://twitter.com/intent/user?user_id=" + data.userId;
    //var avatar_src = 'img/tw.png';
    var avatar = $('<img>').addClass('avatar').attr({src: avatar_src, alt: data.fullName});
    var usernameSpan = $('<a>').addClass('username').attr({href: user_link, target: '_blank'}).html(data.userName ? '@<b>' + data.userName : 'protected user' + '</b>');
    var fullnameSpan = $('<strong>').addClass('fullname').html(data.fullName);
    var timeDiv = $('<div>').addClass('tweet_time').html($('<span>').addClass('tweet-timestamp').html((moment(data.tweetTime)).format(timeFormat))).attr('data-time', (moment(data.tweetTime)).format("YYYY-MM-DD HH:mm:ss"));
    return $('<div>').addClass('stream-item-header')
            .append(avatar)
            .append(usernameSpan)
            .append(fullnameSpan)
            .append(timeDiv);
};