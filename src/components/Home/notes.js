import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import styles from "./styles.module.css";

import NoteList from "./noteList";

class NotesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      notes: [],
      text: "",
      title: "",
      limit: 10,
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
    this.setState({ [e.target.name]: e.target.value });
  };

  onCreateNote = (e, authUser) => {
    e.preventDefault();
    this.props.firebase.notes().push({
      userId: authUser.uid,
      text: this.state.text,
      title: this.state.title,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });
    this.setState({ text: "", title: "" });
  };

  onRemoveNote = (uid) => {
    this.props.firebase.note(uid).remove();
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
    const { text, notes, loading, title } = this.state;
    const { authUser } = this.props;

    return (
      <div className={styles.notesPage}>
        <form
          className={styles.notesForm}
          onSubmit={(e) => this.onCreateNote(e, authUser)}
        >
          <input
            type="text"
            onChange={this.onChange}
            name="title"
            value={title}
            placeholder="Title"
          />
          <textarea
            type="text"
            value={text}
            name="text"
            onChange={this.onChange}
            rows="5"
            cols="20"
            placeholder="Start typing here..."
          />
          <button type="submit" className={styles.addBtn}>
            Add
          </button>
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
          <button
            className={styles.moreBtn}
            type="button"
            onClick={this.onNextPage}
          >
            More
          </button>
        )}
      </div>
    );
  }
}

const Notes = withFirebase(NotesBase);

export default Notes;
