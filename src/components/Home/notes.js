import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import NoteList from "./noteList";

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
      .orderByChild("userId")
      .equalTo(this.props.authUser.uid)
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
    const { authUser } = this.props;

    return (
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
    );
  }
}

const Notes = withFirebase(NotesBase);

export default Notes;
