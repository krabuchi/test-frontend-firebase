import React, { Component } from "react";
import { withAuthorization, AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";

const HomePage = () => (
  <div>
    <Notes />
  </div>
);

class NotesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      notes: [],
      text: "",
      limit: 5,
    };
  }

  componentDidMount() {
    this.onListenForNotes();
  }

  onListenForNotes() {
    this.setState({ loading: true });

    this.props.firebase
      .notes()
      .orderByChild("createdAt")
      .limitToLast(this.state.limit)
      .on("value", (snapshot) => {
        const noteObject = snapshot.val();

        if (noteObject) {
          const noteList = Object.keys(noteObject)
            .map((key) => ({
              ...noteObject[key],
              uid: key,
            }))
            .reverse();
          this.setState({
            notes: noteList,
            loading: false,
          });
        } else {
          this.setState({ notes: null, loading: false });
        }
      });
  }

  onNextPage = () => {
    this.setState(
      (state) => ({ limit: state.limit + 5 }),
      this.onListenForNotes
    );
  };

  componentWillUnmount() {
    this.props.firebase.notes().off();
  }

  onChange = (e) => {
    this.setState({ text: e.target.value });
  };

  onCreateNote = (e, authUser) => {
    e.preventDefault();
    this.props.firebase.notes().push({
      userId: authUser.uid,
      text: this.state.text,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });
    this.setState({ text: "" });
  };

  onRemoveNote = (uid) => {
    this.props.firebase.notes(uid).remove();
  };

  onEditNote = (note, text) => {
    const { uid, ...noteSnapshot } = note;

    this.props.firebase.note(note.uid).set({
      ...noteSnapshot,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  render() {
    const { text, notes, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <div>
            <form onSubmit={(e) => this.onCreateNote(e, authUser)}>
              <textarea
                type="text"
                value={text}
                onChange={this.onChange}
                rows="5"
                cols="33"
              />
              <button type="submit">Add</button>
            </form>

            {loading && <div>Loading ...</div>}

            {notes ? (
              <NoteList
                notes={notes}
                onEditNote={this.onEditNote}
                onRemoveNote={this.onRemoveNote}
                authUser={authUser}
              />
            ) : (
              <div>There are no notes</div>
            )}
            {!loading && notes && (
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
            )}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const NoteList = ({ notes, onRemoveNote, onEditNote, authUser }) => (
  <ul>
    {notes.map((note) => (
      <NoteItem
        authUser={authUser}
        onRemoveNote={onRemoveNote}
        onEditNote={onEditNote}
        key={note.uid}
        note={note}
      />
    ))}
  </ul>
);

class NoteItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.note,
    };
  }

  onChangeEditText = (e) => {
    this.setState({ editText: e.target.value });
  };

  onToggleEditMode = () => {
    this.setState((state) => ({
      editMode: !state.editMode,
      editText: this.props.note.text,
    }));
  };

  onSaveEditText = () => {
    this.props.onEditNote(this.props.note, this.state.editText);
    this.setState({ editMode: false });
  };

  render() {
    const { note, onRemoveNote, authUser } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>
            <strong>{note.userId}</strong> {note.text}
            {note.editedAt && <span>(Edited)</span>}
          </span>
        )}
        {authUser.uid === note.userId && (
          <span>
            {editMode ? (
              <span>
                <button onClick={this.onSaveEditText}>Save</button>
                <button onClick={this.onToggleEditMode}>Reset</button>
              </span>
            ) : (
              <button onClick={this.onToggleEditMode}>Edit</button>
            )}
            {!editMode && (
              <button type="button" onClick={() => onRemoveNote(note.uid)}>
                Delete
              </button>
            )}
          </span>
        )}
      </li>
    );
  }
}

const Notes = withFirebase(NotesBase);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(HomePage);
