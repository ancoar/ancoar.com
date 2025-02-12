/*! jQuery visible 1.0 teamdf.com/jquery-plugins | teamdf.com/jquery-plugins/license (modified by Spab Rice to check a specefic area on screen)*/ ! function(t) {
    t.fn.visible = function(e, i, f, z) {
        var h = t(this).eq(0),
            o = h.get(0),
            n = t(window),
            r = n.scrollTop();
        n = f ? r + f : r + n.outerHeight();
        var s = h.offset().top - z,
            g = s + h.outerHeight() + z;
        return f && (g = s + h.outerHeight() - (f - 3)), h = e === !0 ? g : s, s = e === !0 ? s : g, !!(i === !0 ? o.offsetWidth * o.offsetHeight : !0) && n >= s && h >= r
    }
}(jQuery);