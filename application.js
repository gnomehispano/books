const Lang = imports.lang;

const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;

const MainWindow = imports.mainWindow;

const Application = new Lang.Class({
    Name: 'Application',
    Extends: Gtk.Application,

    _init: function() {
        this.parent({ application_id: 'org.gnome.Books' });
    },

    vfunc_startup: function() {
        this.parent();

        Gtk.init(null);

        this._mainWindow = new MainWindow.MainWindow(this);
    },

    vfunc_activate: function() {
        this._mainWindow.show_all();
    }
});
