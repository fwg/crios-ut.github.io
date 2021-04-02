// Avoid weird jumping of page in Chrome on reload. Due to the fixed header
// and images loading potentially slow the browser gets confused about how
// long the page is (in pixels) and auto-scrolls too far.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

(function(video) {
    if (!video) {
        return;
    }
    if (matchMedia('(prefers-reduced-motion)').matches) {
        video.parentNode.classList.add('skip-video');
        return;
    }
    if (matchMedia(video.getAttribute('data-small-media')).matches) {
        video.src = video.getAttribute('data-small-src');
    }
    video.autoplay = true;
    // skip the video if play event doesnt happen in 3 seconds
    var playTimeout = setTimeout(function(){
        video.parentNode.classList.add('skip-video');
    }, 3e3);
    video.addEventListener('play', function () {
        video.parentNode.classList.add('play-video');
        clearTimeout(playTimeout);
    });
})(document.querySelector('#start-video'));

function resetVideoEmbeds() {
    resetVideoEmbeds.queue.forEach(function (pair) {
        $(pair[0]).replaceWith(pair[1]);
    });
    resetVideoEmbeds.queue = [];
}

resetVideoEmbeds.queue = [];

$('a.video-embed').each(function () {
    var a = this;
    var youtube = a.href.match(/youtu(\.be|be\.com)/);
    var vimeo = a.href.match(/vimeo\.com/);
    var id = a.getAttribute('data-id');
    var src = a.href;

    if (youtube) {
        src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&showinfo=0';
    }

    if (vimeo) {
        src = 'https://player.vimeo.com/video/' + id + '?autoplay=1';
    }

    a.onclick = function (ev) {
        resetVideoEmbeds();
        ev.preventDefault();
        var frame = $('<div class="video-embed">' +
            '<iframe allow="autoplay" allowfullscreen frameborder="0"></iframe>' +
            '</div>');
        frame.attr('data-ratio', a.getAttribute('data-ratio'));
        frame.find('iframe')[0].src = src;
        resetVideoEmbeds.queue.push([frame, a]);
        $(this).replaceWith(frame);
    };
});

$('.videos .tags .dropdown-item').click(function () {
    $('.dropdown-item', this.parentNode).removeClass('active');
    $(this).addClass('active');
    $('#' + this.parentNode.getAttribute('aria-labelledby')).html($(this).html());
    $(this).parents('[data-filter-tag]').attr('data-filter-tag', this.getAttribute('data-filter-tag'))
})