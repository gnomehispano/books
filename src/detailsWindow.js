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

        this._coverPath;
        this._nieTracker;

        let dialogGrid = new Gtk.Grid( { row_spacing: 6,
                                         column_spacing: 6 } );

        this._newCoverImage = new Gtk.Button({ label: "No image" });
        this._newTitleEntry = new Gtk.Entry();
        this._newAuthorEntry = new Gtk.Entry();
        this._newISBNEntry = new Gtk.Entry();
        this._newYearEntry = new Gtk.Entry();
        this._newSummaryTextView = new Gtk.TextView();
        this._newSummaryTextBuffer = new Gtk.TextBuffer();
        this._newNotesTextView = new Gtk.TextView();
        this._newNotesTextBuffer = new Gtk.TextBuffer();
        this._newRating = new Gtk.SpinButton();

        this._newSummaryScrolledWindow = new Gtk.ScrolledWindow();
        this._newNotesScrolledWindow = new Gtk.ScrolledWindow();
        this._newSummaryTextView.buffer = this._newSummaryTextBuffer;
        this._newNotesTextView.buffer = this._newNotesTextBuffer;
        this._newSummaryScrolledWindow.add(this._newSummaryTextView);
        this._newNotesScrolledWindow.add(this._newNotesTextView);

        dialogGrid.attach(this._newCoverImage,
                          0, 0, 1, 5);
        dialogGrid.attach(new Gtk.Label ({ label: "Title",
                                           xalign: 1 }),
                          1, 0, 1, 1);
        dialogGrid.attach(this._newTitleEntry,
                          2, 0, 2, 1);
        dialogGrid.attach(new Gtk.Label ({ label: "Author",
                                           xalign: 1 }),
                          1, 1, 1, 1);
        dialogGrid.attach(this._newAuthorEntry,
                          2, 1, 2, 1);
        dialogGrid.attach(new Gtk.Label ({ label: "ISBN",
                                           xalign: 1 }),
                          1, 2, 1, 1);
        dialogGrid.attach(this._newISBNEntry,
                          2, 2, 2, 1);
        dialogGrid.attach(new Gtk.Label ({ label: "Year",
                                           xalign: 1 }),
                          1, 3, 1, 1);
        dialogGrid.attach(this._newYearEntry,
                          2, 3, 2, 1);
        dialogGrid.attach(new Gtk.Label ({ label: "Rating",
                                           xalign: 1 }),
                          1, 4, 1, 1);
        dialogGrid.attach(this._newRating,
                          2, 4, 1, 1);
        dialogGrid.attach(new Gtk.Label ({ label: "Summary",
                                           xalign: 0 }),
                          0, 5, 1, 1);
        dialogGrid.attach(this._newSummaryScrolledWindow,
                          0, 6, 4, 1);
        dialogGrid.attach(new Gtk.Label ({ label: "Notes",
                                           xalign: 0 }),
                          0, 7, 1, 1);
        dialogGrid.attach(this._newNotesScrolledWindow,
                          0, 8, 4, 1);

        let cancelButton = new Gtk.Button.new_from_stock(Gtk.STOCK_CLOSE);
        cancelButton.connect("clicked", Lang.bind(this, this.hide_on_delete));
        dialogGrid.attach(cancelButton,
                          2, 9, 1, 1);

        let okButton = new Gtk.Button.new_from_stock(Gtk.STOCK_OK);
        okButton.connect("clicked", Lang.bind (this, this._book_window_ok));
        dialogGrid.attach(okButton,
                          3, 9, 1, 1);

        this.add(dialogGrid);
        

        this.connect("delete-event",
                         Lang.bind (this,
                                    this.hide_on_delete));
        
        let updateButtonSensitive = Lang.bind(this, function() {
            okButton.sensitive = this._newTitleEntry.text.length &&
                                 this._newAuthorEntry.text.length;
        });
        this._newTitleEntry.connect('changed', updateButtonSensitive);
        this._newAuthorEntry.connect('changed', updateButtonSensitive);
        updateButtonSensitive();
    },

    _clearInfo: function() {
    this._newTitleEntry.set_text('');
        this._newAuthorEntry.set_text('');
        this.app._bookWindowAction = 'new';
        this._newTitleEntry.grab_focus();
        this.show_all();
    },

    _book_window_ok: function (dialog, response_id) {
        if (this.app._bookWindowAction == 'new') {
            let title = this._newTitleEntry.get_text();
            let author = this._newAuthorEntry.get_text();

            this.hide();

            let book = new workModel.workModel(this.app._work_counter, title, author);
            this.app._work_counter++;
            this.app._append_book(book);

            this.app._bookWindowAction = 'none';
        }
    }

});
