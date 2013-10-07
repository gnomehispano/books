const Lang = imports.lang;

const GObject = imports.gi.GObject;

const workModel = new Lang.Class({
    Name: 'workModel',

    _init: function(title, author) {
        this.title = title;
        this.author = author;
        this.year = null;
        this.comments = null;
    }
});
