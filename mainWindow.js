const Lang = imports.lang;

const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;

const workModel = imports.workModel;
const detailsWindow = imports.detailsWindow;

const MainWindow = new Lang.Class({
    Name: 'MainWindow',
    Extends: Gtk.ApplicationWindow,

    _init: function(app) {
        this.parent({ application: app,
                      hide_titlebar_when_maximized: true,
                      title: "Books" });

        this._box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL,
                                  visible: true });

        this._populate_toolbar();
        this._box.add(this._toolbar);

        this._populate_treeview();
        this._box.add(this._scroll);

        this.add(this._box);

        this._bookWindowAction = 'none';

        this._bookshelf = {};
    },

    _populate_toolbar: function() {
        this._toolbar = new Gtk.Toolbar();
        this._toolbar.get_style_context().add_class(Gtk.STYLE_CLASS_MENUBAR);

        let separator = new Gtk.SeparatorToolItem({ draw: false });
        this._toolbar.add(separator);
        separator.set_expand(true);

        let newAction = new Gio.SimpleAction({ "name": 'new' });
        newAction.connect('activate', Lang.bind(this,
                                                function() {
                                                    this._new_book();
                                                    }));
        this.application.add_action(newAction);

        this._newButton = new Gtk.ToolButton.new_from_stock(Gtk.STOCK_NEW);
        this._newButton.is_important = true;
        this._toolbar.add(this._newButton);
        this._newButton.action_name = "app.new";
    },

    _populate_treeview: function() {
        this._listStore = Gtk.ListStore.new ([ GObject.TYPE_STRING,
                                               GObject.TYPE_STRING ]);
        this._treeView = new Gtk.TreeView ({ expand: true,
                                             model: this._listStore });

        let titleCol = new Gtk.TreeViewColumn ({ title: "Title" });
        let authorCol = new Gtk.TreeViewColumn ({ title: "Author" });

        let normalCell = new Gtk.CellRendererText ();

        titleCol.pack_start(normalCell, true);
        authorCol.pack_start(normalCell, true);

        titleCol.add_attribute(normalCell, "text", 0);
        authorCol.add_attribute(normalCell, "text", 1);

        this._treeView.insert_column(titleCol, 0);
        this._treeView.insert_column(authorCol, 1);

        this._scroll = new Gtk.ScrolledWindow ({ hscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
                                                 vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
                                                 shadow_type: Gtk.ShadowType.ETCHED_IN,
                                                 height_request: 180,
                                                 width_request: 400 });

        this._scroll.add_with_viewport(this._treeView);
    },

    _populate_book_window: function() {
        this._bookWindow = new detailsWindow.DetailsWindow(this);
        this._bookWindow.transient_for = this;
    },

    _book_window_cancel: function (dialog, user_data) {
        this._bookWindow.hide();

        this._bookWindowAction = 'none';
    },

    _new_book: function() {
        if (!this._bookWindow) {
            this._populate_book_window();
        }
	this._bookWindow._clearInfo();
    },

    _append_book: function(bookModel) {
        let iter = this._listStore.append();
        this._listStore.set(iter, [ 0, 1 ], [ bookModel.title, bookModel.author ]);
        this._bookshelf[iter] = bookModel;
    },
});
