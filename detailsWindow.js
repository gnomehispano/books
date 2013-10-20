const Lang = imports.lang;

const Gtk = imports.gi.Gtk;

const workModel = imports.workModel;

const DetailsWindow = new Lang.Class({
    Name: 'DetailsWindow',
    Extends: Gtk.Window,

    _init: function(app) {
	this.parent({ modal: true,
			     title: "Append a new book",
			     window_position: Gtk.WindowPosition.CENTER_ON_PARENT,
			     border_width: 12 });
	this.app = app;

        let dialogGrid = new Gtk.Grid( { row_spacing: 6,
                                         column_spacing: 6 } );

        this._newTitleEntry = new Gtk.Entry();
        this._newAuthorEntry = new Gtk.Entry();
	this._newISBNEntry = new Gtk.Entry();
	

        dialogGrid.attach(new Gtk.Label ({ label: "Title" }),
                          0, 0, 1, 1);
        dialogGrid.attach(this._newTitleEntry,
                          1, 0, 1, 1);
        dialogGrid.attach(new Gtk.Label ({ label: "Author" }),
                          0, 1, 1, 1);
        dialogGrid.attach(this._newAuthorEntry,
                          1, 1, 1, 1);

/*
 * ISBN
 * pixbuf (path)
 * year
 * summary
 * notes
 * rating
 * nie:tracker
 */

        let okButton = new Gtk.Button.new_from_stock(Gtk.STOCK_OK);
        okButton.connect("clicked", Lang.bind (this, this._book_window_ok));
        dialogGrid.attach(okButton,
                          0, 2, 2, 1);

        this.add(dialogGrid);
        

        this.connect("delete-event",
                         Lang.bind (this,
                                    this.hide_on_delete));

    },

    _clearInfo: function() {
	this._newTitleEntry.set_text('');
        this._newAuthorEntry.set_text('');
        this.app._bookWindowAction = 'new';
        this.show_all();
    },

    _book_window_ok: function (dialog, response_id) {
        if (this.app._bookWindowAction == 'new') {
            let title = this._newTitleEntry.get_text();
            let author = this._newAuthorEntry.get_text();
            if (title != "" && author != "") {
                this.hide();

                let book = new workModel.workModel(title, author);
                this.app._append_book(book);

                this.app._bookWindowAction = 'none';
            } else {
                let dialog = new Gtk.Dialog({ transient_for: this,
                                              modal: true,
                                              title: "Missing data" });
                dialog.add_button('gtk-ok', Gtk.ResponseType.OK);
                let label = new Gtk.Label({ label: 'Title and author are required.' });
                dialog.get_content_area().add(label);
                label.show();
                dialog.run();
                dialog.destroy();
            }
        }
    }

});
