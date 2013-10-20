const Lang = imports.lang;

const GObject = imports.gi.GObject;

const workModel = new Lang.Class({
    Name: 'workModel',

    _init: function(id, title, author) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = null;
        this.comments = null;
    }
});
