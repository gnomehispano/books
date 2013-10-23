const Lang = imports.lang;

const GObject = imports.gi.GObject;
const Signals = imports.signals;
const Tracker = imports.gi.Tracker;

const QueryColumns = {
    URN: 0,
    URI: 1,
    FILENAME: 2,
    TITLE: 3,
    AUTHOR: 4,
};

const localProvider = new Lang.Class({
    Name: 'localProvider',

    // Tell the provider to query Tracker looking for local ePub files (filtered
    // explicitly with mimetype). The localProvider will emit 'book-found'
    // signals for each result returned in the query.
    //
    // TODO: 'live query' where we get notified about newly added/removed epubs
    // TODO: currently just author and title are included in the emitted signal
    populate: function() {
        let sparql =
            'SELECT DISTINCT ' +
            '  ?u' + // urn
            '  nie:url(?u)' + // uri
            '  nfo:fileName(?u)' + // filename
            '  nie:title(?u)' + // title
            '  tracker:coalesce(nco:fullname(?creator),' + // creator or...
            '                   nco:fullname(?publisher),' + // ...publisher or...
            '                   \'\') ' + // ...nothing
            'WHERE {' +
            '  ?u a nfo:FileDataObject .' + // limit to files
            '  ?u nie:mimeType \'application/epub+zip\'' + // match files by mimetype
            '  OPTIONAL { ?u nco:publisher ?publisher . }' +
            '  OPTIONAL { ?u nco:creator   ?creator . }' +
            '}';

        try {
            // connect to tracker if not done before
            if (this._connection == null)
                this._connection = Tracker.SparqlConnection.get(null);

            // query to Tracker
            this._connection.query_async(sparql, null, Lang.bind(this, this._onQueryReady));
        } catch (e) {
            log('Unable to query the tracker database: ' + e.toString());
        }
    },

    // query is ready, get the cursor and start iterating it
    _onQueryReady: function(connection, res) {
        try {
            let cursor = connection.query_finish(res);

            cursor.next_async(null, Lang.bind(this, this._onCursorNext));
        } catch (e) {
            log('Unable to query single item ' + e.message);
        }
    },

    // cursor iteration
    _onCursorNext: function(cursor, res) {
        try {
            let valid = cursor.next_finish(res);

            if (!valid) {
                cursor.close();
                return;
            }
        } catch (e) {
            cursor.close();
            return;
        }

        // add book from cursor info
        this._addBookFromCursor(cursor);

        // keep on iterating cursor
        cursor.next_async(null, Lang.bind(this, this._onCursorNext));
    },

    // add a single book from the given cursor row
    _addBookFromCursor: function(cursor) {
        let urn = cursor.get_string(QueryColumns.URN)[0];
        let uri = cursor.get_string(QueryColumns.URI)[0];
        let filename = cursor.get_string(QueryColumns.FILENAME)[0];
        let title = cursor.get_string(QueryColumns.TITLE)[0];
        let author = cursor.get_string(QueryColumns.AUTHOR)[0];

        // TODO: do something with URN, URI and filename if needed

        this.emit('book-found', title, author);
    }
});
Signals.addSignalMethods(localProvider.prototype);
