import React, { Component } from "react";
import styles from "./styles.module.css";

export default class NoteItem extends Component {
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
      <li className={styles.noteItem}>
        {editMode ? (
          <textarea
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
            rows="5"
            cols="20"
          />
        ) : (
          <span className={styles.noteText}>{note.text}</span>
        )}
        {authUser.uid === note.userId && (
          <span className={styles.btnContainer}>
            {editMode ? (
              <span className={styles.btnContainer}>
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
